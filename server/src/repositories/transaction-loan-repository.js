import sql from 'mssql'

import { getConnection } from '../database/db-config.js'

class TransactionLoanRepository {
  static async createTransactionLoan (finalValue, userId, id, finalNewDate, finalEndDate) {
    const pool = await getConnection()

    const transaction = await pool
      .request()
      .input('valorFinal', sql.Real, finalValue)
      .input('userId', sql.Int, userId)
      .input('loanId', sql.Int, id)
      .input('finalNewDate', sql.DateTime, finalNewDate)
      .input('finalEndDate', sql.DateTime, finalEndDate)
      .query(`
        INSERT INTO TransacaoEmprestimo (ValorFinal, DataInicioFinal, DataFimFinal, Nota, PropostaEmprestimoUtilizador_ID, PropostaEmprestimoEmprestimo_ID)
        VALUES (@valorFinal, @finalNewDate, @finalEndDate, 0, @userId, @loanId)
    `)

    return transaction.recordset[0]
  }

  static async getAllLoanTransactions () {
    const pool = await getConnection()

    const transactions = await pool
      .request()
      .query(`
        SELECT *
        FROM TransacaoEmprestimo
    `)

    return transactions.recordset
  }

  static async getLoanTransactionById (id) {
    const pool = await getConnection()

    const transaction = await pool
      .request()
      .input('id', sql.Int, id)
      .query(`
        SELECT *
        FROM TransacaoEmprestimo
        WHERE TransacaoEmprestimo_ID = @id
      `)

    return transaction.recordset[0]
  }
}

export default TransactionLoanRepository
