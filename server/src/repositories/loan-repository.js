import sql from 'mssql'

import { dbConfig, getConnection } from '../database/db-config.js'
import ItemRepository from './item-repository.js'

class LoanRepository {
  static async createLoan ({ data, userId }) {
    const pool = await getConnection(dbConfig)

    const item = await ItemRepository.createItem(data.condition, data.category)

    const loan = await pool
      .request()
      .input('titulo', sql.VarChar, data.title)
      .input('descricao', sql.VarChar, data.description)
      .input('valor', sql.Int, data.price)
      .input('dataInicio', sql.DateTime, data.startDate)
      .input('dataFim', sql.DateTime, data.endDate)
      .input('userId', sql.Int, userId)
      .input('itemId', sql.Int, item.Artigo_ID)
      .query(`
        INSERT INTO 
        Emprestimo (Titulo, Descricao, Valor, DataInicio, DataFim, Utilizador_ID, ArtigoArtigo_ID, EstadoEstado_ID)
        VALUES (@titulo, @descricao, @valor, @dataInicio, @dataFim, @userId, @itemId, 1)
      `)

    return loan.rowsAffected[0] > 0
  }

  static async getLoanById (id) {
    const pool = await getConnection(dbConfig)

    const loan = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT Emprestimo_ID, Titulo, Descricao, DataInicio, DataFim, Valor, NomeCategoria, Condicao, Contacto, Emprestimo.Utilizador_ID, Emprestimo.ArtigoArtigo_ID
        FROM Emprestimo
        JOIN Utilizador ON Utilizador.Utilizador_ID = Emprestimo.Utilizador_ID
        JOIN Artigo ON Artigo.Artigo_ID = Emprestimo.ArtigoArtigo_ID
        JOIN Categoria ON Categoria.Categoria_ID = Artigo.Categoria_ID
        JOIN Condicao ON Condicao.Condicao_ID = Artigo.Condicao_ID
        WHERE Emprestimo_ID = @id
      `)

    return loan.recordset[0]
  }

  static async getAllLoans () {
    const pool = await getConnection(dbConfig)

    const loans = await pool
      .request()
      .query(`
        SELECT * 
        FROM Emprestimo
      `)

    return loans.recordset
  }

  static async getAvailableLoans () {
    const pool = await getConnection(dbConfig)

    const availableLoans = await pool
      .request()
      .query(`
        SELECT Emprestimo_ID, Titulo, Descricao, Valor, DataInicio, DataFim, Utilizador_ID, ArtigoArtigo_ID, Estado
        FROM Emprestimo
        JOIN Estado ON Estado.Estado_ID = Emprestimo.EstadoEstado_ID
        WHERE Estado.Estado = 'Disponível'
      `)

    return availableLoans.recordset
  }

  static async updateLoan (data, id) {
    const pool = await getConnection()

    const transaction = pool.transaction()

    try {
      await transaction.begin()

      await ItemRepository.updateItem(data.category, data.condition, data.itemId, transaction)

      await transaction
        .request()
        .input('id', sql.Int, id)
        .input('dataInicio', sql.DateTime, data.startDate)
        .input('dataFim', sql.DateTime, data.endDate)
        .input('titulo', sql.VarChar, data.title)
        .input('descricao', sql.VarChar, data.description)
        .input('valor', sql.Real, data.value)
        .query(`
          UPDATE Emprestimo
          SET DataInicio = @dataInicio,
              DataFim = @dataFim,
              Titulo = @titulo,
              Descricao = @descricao,
              Valor = @valor
          WHERE Emprestimo_ID = @id
        `)

      await transaction.commit()

      return true
    } catch (error) {
      await transaction.rollback()
    }
  }

  static async getUserLoans (userId) {
    const pool = await getConnection(dbConfig)

    const userLoans = await pool.request()
      .input('userId', sql.Int, userId)
      .query(`
        SELECT * 
        FROM Emprestimo
        WHERE Utilizador_ID = @userId
      `)

    return userLoans.recordset
  }

  static async updateLoanPictures () {

  }

  static async updateLoanStatus (loanId, stateId) {
    const pool = await getConnection()

    const updatedLoan = await pool
      .request()
      .input('loanId', sql.Int, loanId)
      .input('stateId', sql.Int, stateId)
      .query(`
        UPDATE Emprestimo
        SET EstadoEstado_ID = @stateId
        WHERE Emprestimo_ID = @loanId
      `)

    return updatedLoan.rowsAffected[0] > 0
  }
}

export default LoanRepository
