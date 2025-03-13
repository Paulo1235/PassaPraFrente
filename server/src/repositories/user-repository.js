import sql from 'mssql'

import { dbConfig } from '../database/db-config.js'

export class UserRepository {
  static async getUserById (id) {
    const pool = await sql.connect(dbConfig)
    const user = await pool.request()
      .input('id', sql.Int, id)
      .query('select * from Utilizador where Utilizador_ID = @id')
    return user.recordset
  }

  static async getUserByEmail (email) {
    const pool = await sql.connect(dbConfig)
    const user = await pool.request()
      .input('email', sql.VarChar, email)
      .query('select * from Utilizador Join Autenticacao on Utilizador.Utilizador_ID = Autenticacao.Utilizador_ID')
    return user.recordset
  }

  static async getAllUsers () {
    const pool = await sql.connect(dbConfig)
    const users = await pool.request()
      .query('select * from Utilizador')
    return users.recordset
  }

  static async createUser (input) {
    const pool = await sql.connect(dbConfig)

    const typeUserId = 1

    const user = await pool.request()
      .input('nome', sql.VarChar, input.name)
      .input('dataNasc', sql.Date, input.birthDate)
      .input('imagemURL', sql.VarChar, input.imageUrl)
      .input('contacto', sql.VarChar, input.contact)
      .input('tipoUtilizadorID', sql.Int, typeUserId)
      .query(`
        INSERT INTO Utilizador (Nome, DataNasc, ImagemURL, Contacto, TipoUtilizador_ID)
        VALUES (@nome, @dataNasc, @imagemURL, @contacto, @tipoUtilizadorID)
      `)

    return user.recordset
  }

  static async deleteUser (id) {
    const pool = await sql.connect(dbConfig)
    await pool.request()
      .input('id', sql.Int, id)
      .query('delete from Utilizador where Utilizador_ID = @id')
    return true
  }

  static async updateUser ({ id, nome, dataNasc, imagemURL, contacto }) {
    const pool = await sql.connect(dbConfig)
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
