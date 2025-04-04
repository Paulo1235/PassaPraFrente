import sql from 'mssql'

import { closeConnection, getConnection } from '../database/db-config.js'

export class UserRepository {
  static async getUserById (id) {
    const pool = await getConnection()

    const user = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT Utilizador.Utilizador_ID, Nome, DataNasc, Contacto, Email, ConfirmarEmail, Password, TipoUtilizador.TipoUtilizador
        FROM Utilizador 
        JOIN Autenticacao ON Utilizador.Utilizador_ID = Autenticacao.Utilizador_ID 
        JOIN TipoUtilizador ON TipoUtilizador.TipoUtilizador_ID = Utilizador.TipoUtilizador_ID
        WHERE Utilizador.Utilizador_ID = @id
        `)

    await closeConnection(pool)

    return user.recordset[0]
  }

  static async getUserByEmail (email) {
    const pool = await getConnection()

    const user = await pool.request()
      .input('email', sql.VarChar, email)
      .query(
        `SELECT Utilizador.Utilizador_ID, Nome, DataNasc, Contacto, TipoUtilizador_ID, Email, ConfirmarEmail, Password
         FROM Utilizador 
         JOIN Autenticacao ON Utilizador.Utilizador_ID = Autenticacao.Utilizador_ID 
         WHERE email = @email
      `)

    await closeConnection(pool)

    return user.recordset[0]
  }

  static async existsUserByEmail (email) {
    const pool = await getConnection()

    const user = await pool.request()
      .input('email', sql.VarChar, email)
      .query(
        `SELECT Email
         FROM Autenticacao 
         WHERE email = @email
      `)

    await closeConnection(pool)

    if (user.rowsAffected[0] > 0) {
      return true
    }

    return false
  }

  static async getAllUsers () {
    const pool = await getConnection()

    const users = await pool.request()
      .query(`
        SELECT Utilizador.Utilizador_ID, Nome, DataNasc, ImagemURL, Contacto, TipoUtilizador_ID, Email, ConfirmarEmail
        FROM Utilizador 
        JOIN Autenticacao ON Utilizador.Utilizador_ID = Autenticacao.Utilizador_ID
      `)

    await closeConnection(pool)

    return users.recordset
  }

  static async createUser (input) {
    const pool = await getConnection()

    const transaction = pool.transaction()

    try {
      await transaction.begin()

      const user = await transaction.request()
        .input('nome', sql.VarChar, input.name)
        .input('dataNasc', sql.Date, input.birthDate)
        .input('contacto', sql.VarChar, input.contact)
        .query(`
          INSERT INTO Utilizador (Nome, DataNasc, Contacto, TipoUtilizador_ID)
          OUTPUT INSERTED.Utilizador_ID
          VALUES (@nome, @dataNasc, @contacto, 1)
        `)

      const userId = user.recordset[0].Utilizador_ID

      await transaction.request()
        .input('email', sql.VarChar, input.email)
        .input('password', sql.VarChar, input.password)
        .input('utilizadorId', sql.Int, userId)
        .query(`
          INSERT INTO Autenticacao (Email, Password, Utilizador_ID)
          VALUES (@email, @password, @utilizadorId)
        `)

      await transaction.commit()

      return { userId, ...input }
    } catch (error) {
      await transaction.rollback()
      console.error('Internal error: ', error.message)
    } finally {
      await closeConnection(pool)
    }
  }

  static async deleteUser (id) {
    const pool = await getConnection()

    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Utilizador WHERE Utilizador_ID = @id')

    await closeConnection(pool)

    return true
  }

  static async updateUser ({ id, nome, dataNasc, imagemURL, contacto }) {
    const pool = await getConnection()

    const user = await pool.request()
      .input('nome', sql.VarChar, nome)
      .input('dataNasc', sql.Date, dataNasc)
      .input('imagemURL', sql.VarChar, imagemURL)
      .input('contacto', sql.VarChar, contacto)
      .input('id', sql.Int, id)
      .query('update Utilizador set  Nome = @nome, DataNasc = @dataNasc, Imagem_URL = @imagemURL, Contacto = @contacto where Utilizador_ID = @id')

    await closeConnection(pool)

    return user.recordset
  }

  static async activateUser (id) {
    const pool = await getConnection()

    const confirmEmailValue = 1

    const updatedUser = await pool.request()
      .input('id', sql.Int, id)
      .input('confirmarEmail', sql.Int, confirmEmailValue)
      .query('UPDATE Autenticacao SET ConfirmarEmail = @confirmarEmail WHERE Utilizador_ID = @id')

    await closeConnection(pool)

    if (updatedUser.rowsAffected[0] > 0) {
      return true
    }

    return false
  }

  static async getUserRole (id) {
    const pool = await getConnection()

    const user = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT TipoUtilizador 
        FROM TipoUtilizador 
        JOIN Utilizador ON Utilizador.TipoUtilizador_ID = TipoUtilizador.TipoUtilizador_ID 
        WHERE Utilizador.Utilizador_ID = @id
      `)

    await closeConnection(pool)

    return user.recordset[0]
  }

  static async updateUserPassword (id, password) {
    const pool = await getConnection()

    const updatedUser = await pool.request()
      .input('id', sql.Int, id)
      .input('password', sql.VarChar, password)
      .query(`
        UPDATE Autenticacao 
        SET Password = @password 
        WHERE Utilizador_ID = @id
      `)

    await closeConnection(pool)

    return updatedUser.recordset
  }

  static async uploadUserAvatar (id, publicId, url) {
    const pool = await getConnection()

    const user = await pool
      .request()
      .input('id', sql.Int, id)
      .input('publicId', sql.VarChar, publicId)
      .input('url', sql.VarChar, url)
      .query(`
        INSERT INTO ImagemUtilizador (Utilizador_ID, Public_ID, Url)
        VALUES (@id, @publicId, @url)
    `)

    await closeConnection(pool)

    return user.rowsAffected[0] > 0
  }

  static async getUserAvatar (id) {
    const pool = await getConnection()

    const avatar = await pool
      .request()
      .input('id', sql.Int, id)
      .query(`
        SELECT PublicID, Url
        FROM ImagemUtilizador
        WHERE Utilizador_ID = @id
      `)

    await closeConnection(pool)

    return avatar.recordset
  }

  static async updateUserAvatar (id, publicId, url) {
    const pool = await getConnection()

    const updatedAvatar = await pool
      .request()
      .input('id', sql.Int, id)
      .input('publicId', sql.VarChar, publicId)
      .input('url', sql.VarChar, url)
      .query(`
        UPDATE ImagemUtilizador
        SET PublicID = @publicId, Url = @url
        WHERE Utilizador_ID = @id
      `)

    await closeConnection(pool)

    return updatedAvatar.rowsAffected[0] > 0
  }
}
