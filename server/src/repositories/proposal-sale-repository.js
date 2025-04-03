import sql from 'mssql'

import { getConnection, closeConnection } from '../database/db-config'

export class ProposalSaleRepository {
  static async createProposalSale (novoValor) {
    const pool = await getConnection()

    const proposal = await pool
      .request()
      .input('novoValor', sql.Float, novoValor)
      .query(`
        INSERT INTO PropostaVenda(NovoValor) VALUES (@novoValor)
    `)

    await closeConnection(pool)

    return proposal.recordset[0]
  }

  static async getAllSaleProposals () {
    const pool = await getConnection()

    const proposals = await pool
      .request()
      .query(`
        SELECT *
        FROM PropostaVenda
    `)

    return proposals.recordset
  }

  static async getSaleProposalById (userId, saleId) {
    const pool = await getConnection()

    const proposal = await pool
      .request()
      .input('userId', sql.Int, userId)
      .input('saleId', sql.Int, saleId)
      .query(`
        SELECT *
        FROM PropostaVenda
        WHERE Venda_ID = @saleId AND Utilizador_ID = @userId
      `)

    return proposal.recordset
  }

  static async updateProposalSaleStatus (userId, saleId, status) {
    const pool = await getConnection()

    const updatedProposal = pool.request()
      .input('vendaId', sql.Int, saleId)
      .input('userId', sql.Int, userId)
      .input('status', sql.TinyInt, status)
      .query(`
        UPDATE PropostaVenda
        SET Aceite = @status
        WHERE Venda_ID = @vendaId AND Utilizador_ID = @userId
      `)

    await closeConnection(pool)

    return updatedProposal.recordset
  }
}
