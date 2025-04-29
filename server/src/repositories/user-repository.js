import sql from 'mssql'

import { getConnection } from '../database/db-config.js'
import { USER_ROLES, VERIFIED_USER } from '../constants/user-constants.js'

class UserRepository {
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

    return user.rowsAffected[0] > 0
  }

  static async getAllUsers () {
    const pool = await getConnection()

    const users = await pool.request()
      .query(`
        SELECT Utilizador.Utilizador_ID, Nome, DataNasc, ImagemURL, Contacto, TipoUtilizador_ID, Email, ConfirmarEmail
        FROM Utilizador 
        JOIN Autenticacao ON Utilizador.Utilizador_ID = Autenticacao.Utilizador_ID
      `)

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
        .input('tipoUtilizador', sql.Int, USER_ROLES.USER)
        .query(`
          INSERT INTO Utilizador (Nome, DataNasc, Contacto, TipoUtilizador_ID)
          OUTPUT INSERTED.Utilizador_ID
          VALUES (@nome, @dataNasc, @contacto, @tipoUtilizador)
        `)

      const userId = user.recordset[0].Utilizador_ID

      await transaction.request()
        .input('email', sql.VarChar, input.email)
        .input('password', sql.VarChar, input.password)
        .input('utilizadorId', sql.Int, userId)
        .input('confirmarEmail', sql.Int, VERIFIED_USER.UNVERIFIED)
        .query(`
          INSERT INTO Autenticacao (Email, Password, Utilizador_ID, ConfirmarEmail)
          VALUES (@email, @password, @utilizadorId, @confirmarEmail)
        `)

      await transaction.commit()

      return { userId, ...input }
    } catch (error) {
      await transaction.rollback()
      console.error('Internal error: ', error.message)
    }
  }

  static async updateUser (data, id) {
    const pool = await getConnection()

    const user = await pool.request()
      .input('name', sql.VarChar, data.name)
      .input('contact', sql.VarChar, data.contact)
      .input('id', sql.Int, id)
      .query(`
        UPDATE Utilizador 
        SET 
          Nome = @name, 
          Contacto = @contact 
        WHERE Utilizador_ID = @id`
      )

    return user.recordset
  }

  static async activateUser (id) {
    const pool = await getConnection()

    const updatedUser = await pool.request()
      .input('id', sql.Int, id)
      .input('confirmarEmail', sql.Int, VERIFIED_USER.VERIFIED)
      .query(`
        UPDATE Autenticacao 
        SET ConfirmarEmail = @confirmarEmail 
        WHERE Utilizador_ID = @id`
      )

    return updatedUser.rowsAffected[0] > 0
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
        INSERT INTO ImagemUtilizador (Utilizador_ID, PublicID, Url)
        VALUES (@id, @publicId, @url)
    `)

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

    return avatar.recordset[0]
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

    return updatedAvatar.rowsAffected[0] > 0
  }

  static async getUserWithAvatar (id) {
    const pool = await getConnection()

    const user = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT Utilizador.Utilizador_ID, Nome, DataNasc, ImagemURL, Contacto, TipoUtilizador.TipoUtilizador_ID, Email, ConfirmarEmail, PublicID, Url, TipoUtilizador.TipoUtilizador
        FROM Utilizador 
        JOIN Autenticacao ON Utilizador.Utilizador_ID = Autenticacao.Utilizador_ID
        JOIN TipoUtilizador ON TipoUtilizador.TipoUtilizador_ID = Utilizador.TipoUtilizador_ID
        LEFT JOIN ImagemUtilizador ON ImagemUtilizador.Utilizador_ID = Utilizador.Utilizador_ID
        WHERE Utilizador.Utilizador_ID = @id
      `)

    return user.recordset[0]
  }
}

export default UserRepository
