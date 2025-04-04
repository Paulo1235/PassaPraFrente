import sql from 'mssql'

import { getConnection, closeConnection } from '../database/db-config.js'

export class TransationSaleRepository {
  static async createTransationSale (valorFinal, nota) {
    const pool = await getConnection()

    const transation = await pool
      .request()
      .input('valorFinal', sql.Float, valorFinal)
      .input('nota', sql.Int, nota)
      .query(`
        INSERT INTO TransacaoVenda(NovoValor,Nota) VALUES (@valorFinal, @nota)
    `)

    await closeConnection(pool)

    return proposal.recordset[0]
  }

  static async getAllTransationSalesProposals () {
    const pool = await getConnection()

    const proposals = await pool
      .request()
      .query(`
        SELECT *
        FROM TransacaoVenda
    `)

    return proposals.recordset
  }

  static async getSaleProposalById (transacaoSaleId) {
    const pool = await getConnection()

    const proposal = await pool
      .request()
      .input('id', sql.Int, transacaoSaleId)
      .query(`
        SELECT *
        FROM TransacaoVenda
        WHERE TransacaoVenda_ID = @id
      `)

    return proposal.recordset
  }

  static async updateProposalSaleStatus (valorFinal, nota,transacaoSaleId) {
    const pool = await getConnection()

    const updatedProposal = await pool
      .request()
      .input('id', sql.Int, transacaoSaleId)
      .input('valorFinal', sql.Float, valorFinal)
      .input('nota', sql.Int, nota)
      .query(`
        UPDATE TransacaoVenda
        SET ValorFinal = @valorFinal, Nota = @nota
        WHERE TransacaoVenda_ID = @transacaoSaleId
      `)

    await closeConnection(pool)

    return updatedProposal.recordset
  }
}
