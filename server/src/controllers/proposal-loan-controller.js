import { StatusCodes } from 'http-status-codes'

import { handleError, HttpException } from '../utils/error-handler.js'
import response from '../utils/response.js'
import ProposalLoanRepository from '../repositories/proposal-loan-repository.js'
import LoanRepository from '../repositories/loan-repository.js'
import { PROPOSAL_LOAN_STATES } from '../constants/status-constants.js'
import TransactionLoanController from './transaction-loan-controller.js'
import NotificationController from './notification-controller.js'

class ProposalLoanController {
  static async createProposalLoan (req, res) {
    const data = req.body

    const userId = req.user.Utilizador_ID
    const { id } = req.params

    try {
      const loan = await LoanRepository.getLoanById(id)

      const newValue = data.price ?? loan.Valor
      const newStartDate = data.newStartDate ?? loan.DataInicio
      const newEndDate = data.newEndDate ?? loan.DataFim

      if (loan.Estado === 'Concluído' || loan.Estado === 'Em análise' || loan.Estado === 'Rejeitado') {
        throw new HttpException('Não é possível fazer uma proposta para este empréstimo.', StatusCodes.BAD_REQUEST)
      }

      if (loan.Utilizador_ID === userId) {
        throw new HttpException('Não é possível fazer uma proposta para o seu próprio empréstimo.', StatusCodes.BAD_REQUEST)
      }

      const proposal = await ProposalLoanRepository.getLoanProposalById(userId, id)

      if (proposal) {
        throw new HttpException('Já fez uma proposta para este empréstimo.', StatusCodes.BAD_REQUEST)
      }

      await ProposalLoanRepository.createProposalLoan(userId, id, newValue, newStartDate, newEndDate, PROPOSAL_LOAN_STATES.EM_ANALISE)

      return response(res, true, StatusCodes.CREATED, 'Proposta de empréstimo criada com sucesso.')
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao criar proposta.')
    }
  }

  static async getAllLoanProposals (req, res) {
    try {
      const proposals = await ProposalLoanRepository.getAllLoanProposals()

      return response(res, true, StatusCodes.OK, proposals)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar as propostas.')
    }
  }

  static async getLoanProposalById (req, res) {
    const { id } = req.params

    try {
      const proposal = await ProposalLoanRepository.getLoanProposalById(id)

      if (!proposal) {
        throw new HttpException('Proposta não encontrada.', StatusCodes.NOT_FOUND)
      }

      return response(res, true, StatusCodes.OK, proposal)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar a proposta.')
    }
  }

  static async updateProposalLoanStatus (req, res) {
    const { status } = req.body
    const { id, userId } = req.params

    try {
      const loan = await LoanRepository.getLoanById(id)

      if (!loan) {
        throw new HttpException('Não foi possível encontrar o empréstimo.', StatusCodes.NOT_FOUND)
      }

      const proposal = await ProposalLoanRepository.getLoanProposalById(userId, id)

      if (!proposal) {
        throw new HttpException('Não foi possível encontrar a proposta', StatusCodes.NOT_FOUND)
      }

      if (proposal.Aceite === PROPOSAL_LOAN_STATES.ACEITE) {
        throw new HttpException('Esta proposta já foi aceite.', StatusCodes.BAD_REQUEST)
      }

      await ProposalLoanRepository.updateProposalLoanStatus(userId, id, status)

      const notificationData = {
        message: `A sua proposta para ${loan.Titulo} foi ${parseInt(status) === PROPOSAL_LOAN_STATES.ACEITE ? 'aceite' : 'recusada'}`,
        category: 'Empréstimo',
        userId
      }

      NotificationController.createNotification(notificationData)

      // Se a proposta for aceite, cria diretamente a transação
      if (parseInt(status) === PROPOSAL_LOAN_STATES.ACEITE) {
        const createdTransaction = await TransactionLoanController.createTransactionLoan(proposal.NovoValor, userId, id, proposal.NovaDataInicio, proposal.NovaDataFim)

        if (createdTransaction) {
          return response(res, true, StatusCodes.CREATED, 'Transação criada com sucesso.')
        }

        return response(res, false, StatusCodes.BAD_REQUEST, 'Ocorreu um erro ao criar a transação ao aceitar a proposta.')
      }

      return response(res, true, StatusCodes.OK, 'Estado da proposta atualizado.')
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao atualizar o estado da proposta.')
    }
  }

  static async getLoanProposalsByUser (req, res) {
    const userId = req.user.Utilizador_ID

    try {
      const proposals = await ProposalLoanRepository.getLoanProposalsByUser(userId)

      return response(res, true, StatusCodes.OK, proposals)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar as propostas.')
    }
  }

  static async getAllProposalEntriesByLoan (req, res) {
    const userId = req.user.Utilizador_ID
    const proposals = []

    try {
      const loans = await LoanRepository.getUserLoans(userId)

      const loanIds = loans.map(loan => loan.Emprestimo_ID)

      for (const loanId of loanIds) {
        const proposal = await ProposalLoanRepository.getLoanProposalByLoanId(loanId)

        if (proposal) {
          proposals.push(proposal)
        }
      }

      return response(res, true, StatusCodes.OK, proposals)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar as propostas.')
    }
  }
}

export default ProposalLoanController
