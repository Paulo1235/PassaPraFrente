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
        OUTPUT Inserted.TransacaoEmprestimo_ID
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

  static async getLoanTransactionById (id, userId) {
    const pool = await getConnection()

    const transaction = await pool
      .request()
      .input('loanId', sql.Int, id)
      .input('userId', sql.Int, userId)
      .query(`
        SELECT *
        FROM TransacaoEmprestimo
        WHERE PropostaEmprestimoUtilizador_ID = @userId AND PropostaEmprestimoEmprestimo_ID = @loanId 
      `)

    return transaction.recordset[0]
  }

  static async getLoanTransactionByTransactionId (id) {
    const pool = await getConnection()

    const transaction = await pool
      .request()
      .input('loanId', sql.Int, id)
      .query(`
        SELECT *
        FROM TransacaoEmprestimo
        WHERE TransacaoEmprestimo_ID = @loanId 
      `)

    return transaction.recordset[0]
  }

  static async updateLoanReview (data) {
    const pool = await getConnection()

    const updatedTransaction = await pool
      .request()
      .input('transactionId', sql.Int, data.id)
      .input('review', sql.Int, data.review)
      .query(`
        UPDATE TransacaoEmprestimo
        SET Nota = @review
        WHERE TransacaoEmprestimo_ID = @transactionId  
      `)

    return updatedTransaction.rowsAffected[0] > 0
  }

  static async getTransactionByLoanId (id) {
    const pool = await getConnection()

    const transaction = await pool
      .request()
      .input('loanId', sql.Int, id)
      .query(`
        SELECT *
        FROM TransacaoEmprestimo
        WHERE PropostaEmprestimoEmprestimo_ID = @loanId
      `)

    return transaction.recordset[0]
  }

  static async getLoanTransactionByUserId (userId) {
    const pool = await getConnection()

    const transaction = await pool
      .request()
      .input('userId', sql.Int, userId)
      .query(`
        SELECT TransacaoEmprestimo_ID, ValorFinal, Nota, PropostaEmprestimoUtilizador_ID, PropostaEmprestimoEmprestimo_ID, Emprestimo.Titulo, Emprestimo.Descricao, Categoria.NomeCategoria, Utilizador.Utilizador_ID, Utilizador.Nome
        FROM TransacaoEmprestimo
        JOIN Emprestimo ON Emprestimo.Emprestimo_ID = TransacaoEmprestimo.PropostaEmprestimoEmprestimo_ID
        JOIN Utilizador ON Utilizador.Utilizador_ID = TransacaoEmprestimo.PropostaEmprestimoUtilizador_ID
        JOIN Artigo ON Artigo.Artigo_ID = Emprestimo.ArtigoArtigo_ID
        JOIN Categoria ON Categoria.Categoria_ID = Artigo.Categoria_ID
        WHERE PropostaEmprestimoUtilizador_ID = @userId
      `)

    return transaction.recordset[0]
  }
}

export default TransactionLoanRepository
