import sql from 'mssql'

import { getConnection } from '../database/db-config.js'

export class UserRepository {
  static async getUserById (id) {
    const pool = await getConnection()

    const user = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Utilizador WHERE Utilizador_ID = @id')

    return user.recordset
  }

  static async getUserByEmail (email) {
    const pool = await getConnection()

    const user = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM Utilizador JOIN Autenticacao ON Utilizador.Utilizador_ID = Autenticacao.Utilizador_ID WHERE email = @email')

    return user.recordset[0]
  }

  static async getAllUsers () {
    const pool = await getConnection()

    const users = await pool.request()
      .query('SELECT * FROM Utilizador JOIN Autenticacao ON Utilizador.Utilizador_ID = Autenticacao.Utilizador_ID')

    return users.recordset
  }

  static async createUser (input) {
    const pool = await getConnection()
    const transaction = pool.transaction()

    const typeUserId = 1

    try {
      await transaction.begin()

      const user = await transaction.request()
        .input('nome', sql.VarChar, input.name)
        .input('dataNasc', sql.Date, input.birthDate)
        .input('imagemURL', sql.VarChar, input.imageUrl)
        .input('contacto', sql.VarChar, input.contact)
        .input('tipoUtilizadorID', sql.Int, typeUserId)
        .query(`
        INSERT INTO Utilizador (Nome, DataNasc, ImagemURL, Contacto, TipoUtilizador_ID)
        OUTPUT INSERTED.Utilizador_ID
        VALUES (@nome, @dataNasc, @imagemURL, @contacto, @tipoUtilizadorID)
      `)

      const userId = user.recordset[0].Utilizador_ID

      await transaction.request()
        .input('email', sql.VarChar, input.email)
        .input('password', sql.VarChar, input.password)
        .input('confirmarEmail', sql.TinyInt, input.confirmarEmail)
        .input('utilizadorId', sql.Int, userId)
        .query(`
        INSERT INTO Autenticacao (Email, Password, ConfirmarEmail, Utilizador_ID)
        VALUES (@email, @password, @confirmarEmail, @utilizadorId)
    `)

      await transaction.commit()

      return { userId, ...input }
    } catch (error) {
      await transaction.rollback()
      console.error('Internal error: ', error.message)
    }
  }

  static async deleteUser (id) {
    const pool = await getConnection()

    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Utilizador WHERE Utilizador_ID = @id')

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
      .query('update Utilizador set  Nome =@ nome, DataNasc = @dataNasc, Imagem_URL = @imagemURL, Contacto = @contacto where Utilizador_ID = @id')

    return user.recordset
  }
}
