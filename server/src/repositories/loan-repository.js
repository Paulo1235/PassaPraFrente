import sql from 'mssql'

import { dbConfig, getConnection } from '../database/db-config.js'
import ItemRepository from './item-repository.js'

class LoanRepository {
  static async createLoan ({ data, userId }) {
    const pool = await getConnection(dbConfig)

    const item = await ItemRepository.createItem(data.condition, data.category)

    const loan = await pool
      .request()
      .input('titulo', sql.VarChar, data.titulo)
      .input('descricao', sql.VarChar, data.descricao)
      .input('valor', sql.Int, data.valor)
      .input('dataInicio', sql.DateTime, data.dataInicio)
      .input('dataFim', sql.DateTime, data.dataFim)
      .input('userId', sql.Int, userId)
      .input('itemId', sql.Int, item.Artigo_ID)
      .query(`
        INSERT INTO 
        Emprestimo (Titulo, Descricao, Valor, DataInicio, DataFim, Utilizador_ID, Artigo_ID, Estado_ID)
        VALUES (@titulo, @descricao, @valor, @dataInicio, @dataFim, @userId, @itemId, 1)
      `)

    return loan.rowsAffected[0] > 0
  }

  static async getLoanById (id) {
    const pool = await getConnection(dbConfig)

    const loan = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT * 
        FROM Emprestimo
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
        SELECT * 
        FROM Emprestimo
        JOIN Estado ON Estado.Estado_ID = Emprestimo.Estado_ID
        WHERE Estado = 'Disponível'
      `)

    return availableLoans.recordset
  }

  static async updateLoan (data, id) {
    const pool = await getConnection(dbConfig)

    const updatedLoan = await pool.request()
      .input('titulo', sql.VarChar, data.title)
      .input('descricao', sql.VarChar, data.description)
      .input('valor', sql.Float, data.value)
      .input('dataInicio', sql.DateTime, data.startDate)
      .input('dataFim', sql.DateTime, data.endDate)
      .input('idEmprestimo', sql.Int, id)
      .query(`
        UPDATE Emprestimo
        SET 
            Titulo = @titulo,
            Descricao = @descricao,
            Valor = @valor,
            DataInicio = @dataInicio,
            DataFim = @dataFim
        WHERE Emprestimo_ID = @idEmprestimo
      `)

    return updatedLoan.rowsAffected[0] > 0
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
        SET Estado_ID = @stateId
        WHERE Emprestimo_ID = @loanId
      `)

    return updatedLoan.rowsAffected[0] > 0
  }
}

export default LoanRepository
