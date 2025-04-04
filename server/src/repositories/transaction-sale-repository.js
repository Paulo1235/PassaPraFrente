import sql from 'mssql'

import { getConnection, closeConnection } from '../database/db-config.js'

export class TransactionSaleRepository {
  static async createTransactionSale (valorFinal, nota) {
    const pool = await getConnection()

    const transaction = await pool
      .request()
      .input('valorFinal', sql.Float, valorFinal)
      .input('nota', sql.Int, nota)
      .query(`
        INSERT INTO TransacaoVenda (NovoValor, Nota) VALUES (@valorFinal, @nota)
    `)

    await closeConnection(pool)

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

    await closeConnection(pool)

    return transactions.recordset
  }

  static async getSaleTransactionById (id) {
    const pool = await getConnection()

    const transaction = await pool
      .request()
      .input('id', sql.Int, id)
      .query(`
        SELECT *
        FROM TransacaoVenda
        WHERE TransacaoVenda_ID = @id
      `)

    await closeConnection(pool)

    return transaction.recordset[0]
  }
}
