import sql from 'mssql'

import { getConnection } from '../database/db-config.js'

class ProposalSaleRepository {
  static async createProposalSale (newValue, userId, saleId) {
    const pool = await getConnection()

    const proposal = await pool
      .request()
      .input('novoValor', sql.Float, newValue)
      .input('userId', sql.Int, userId)
      .input('saleId', sql.Int, saleId)
      .query(`
        INSERT INTO 
        PropostaVenda (Utilizador_ID, Venda_ID, NovoValor, Aceite) 
        VALUES (@userId, @saleId, @novoValor, 0)
    `)

    return proposal.recordset
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

    return proposal.recordset[0]
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

    return updatedProposal.recordset[0]
  }

  static async getSaleProposalsByUser (userId) {
    const pool = await getConnection()

    const proposal = await pool
      .request()
      .input('userId', sql.Int, userId)
      .query(`
        SELECT *
        FROM PropostaVenda
        WHERE Utilizador_ID = @userId
      `)
    return proposal.recordset
  }

  static async getAllProposalEntriesBySale (id) {
    const pool = await getConnection()

    const proposal = await pool
      .request()
      .input('saleId', sql.Int, id)
      .query(`
        SELECT *
        FROM PropostaVenda
        WHERE Venda_ID = @saleId
        
      `)

    return proposal.recordset
  }
}

export default ProposalSaleRepository
