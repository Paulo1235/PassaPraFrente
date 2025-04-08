import sql from 'mssql'

import { getConnection } from '../database/db-config.js'

class ProposalLoanRepository {
  static async createProposalLoan (newValue, newStartDate, newEndDate) {
    const pool = await getConnection()

    const proposal = await pool
      .request()
      .input('novoValor', sql.Float, newValue)
      .input('novaDataInicio', sql.DateTime, newStartDate)
      .input('novaDataFim', sql.DateTime, newEndDate)
      .query(`
        INSERT INTO 
        PropostaEmprestimo(NovoValor, NovaDataInicio, NovaDataFim) 
        VALUES (@novoValor, @novaDataInicio, @novaDataFim)
    `)

    return proposal.recordset[0]
  }

  static async getAllLoanProposals () {
    const pool = await getConnection()

    const proposals = await pool
      .request()
      .query(`
        SELECT *
        FROM PropostaEmprestimo
    `)

    return proposals.recordset
  }

  static async getLoanProposalById (userId, loanId) {
    const pool = await getConnection()

    const proposal = await pool
      .request()
      .input('userId', sql.Int, userId)
      .input('emprestimoId', sql.Int, loanId)
      .query(`
        SELECT *
        FROM PropostaEmprestimo
        WHERE Emprestimo_ID = @loanId AND Utilizador_ID = @userId
      `)

    return proposal.recordset
  }

  static async updateProposalLoanStatus (userId, loanId, status) {
    const pool = await getConnection()

    const updatedProposal = pool.request()
      .input('emprestimoId', sql.Int, loanId)
      .input('userId', sql.Int, userId)
      .input('status', sql.TinyInt, status)
      .query(`
        UPDATE PropostaEmprestimo
        SET Aceite = @status
        WHERE Emprestimo_ID = @emprestimoId AND Utilizador_ID = @userId
      `)

    return updatedProposal.recordset
  }
}

export default ProposalLoanRepository
