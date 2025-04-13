import sql from 'mssql'

import { getConnection } from '../database/db-config.js'

class TransactionSaleRepository {
  static async createTransactionSale (finalValue, userId, id) {
    const pool = await getConnection()

    const transaction = await pool
      .request()
      .input('valorFinal', sql.Real, finalValue)
      .input('userId', sql.Int, userId)
      .input('saleId', sql.Int, id)
      .query(`
        INSERT INTO TransacaoVenda (ValorFinal, Nota, PropostaVendaUtilizador_ID, PropostaVendaVenda_ID)
        OUTPUT Inserted.TransacaoVenda_ID
        VALUES (@valorFinal, 0, @userId, @saleId)
    `)

    return transaction.recordset[0]
  }

  static async getAllSaleTransactions () {
    const pool = await getConnection()

    const transactions = await pool
      .request()
      .query(`
        SELECT *
        FROM TransacaoVenda
    `)

    return transactions.recordset
  }

  static async getSaleTransactionById (saleId, userId) {
    const pool = await getConnection()

    const transaction = await pool
      .request()
      .input('saleId', sql.Int, saleId)
      .input('userId', sql.Int, userId)
      .query(`
        SELECT *
        FROM TransacaoVenda
        WHERE PropostaVendaVenda_ID = @saleId AND PropostaVendaUtilizador_ID = @userId
      `)

    return transaction.recordset[0]
  }

  static async getSaleTransactionByTransactionId (id) {
    const pool = await getConnection()

    const transaction = await pool
      .request()
      .input('saleId', sql.Int, id)
      .query(`
        SELECT *
        FROM TransacaoVenda
        WHERE PropostaVendaVenda_ID = @saleId 
      `)

    return transaction.recordset[0]
  }

  static async updateSaleReview (data) {
    const pool = await getConnection()

    const updatedTransaction = await pool
      .request()
      .input('transactionId', sql.Int, data.id)
      .input('review', sql.Int, data.review)
      .query(`
        UPDATE TransacaoVenda
        SET Nota = @review
        WHERE TransacaoVenda_ID = @transactionId  
      `)

    return updatedTransaction.rowsAffected[0] > 0
  }
}

export default TransactionSaleRepository
