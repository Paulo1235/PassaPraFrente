import { StatusCodes } from 'http-status-codes'

import { handleError, HttpException } from '../utils/error-handler.js'
import response from '../utils/response.js'
import ProposalLoanRepository from '../repositories/proposal-loan-repository.js'
import LoanRepository from '../repositories/loan-repository.js'
import { LOAN_STATES, PROPOSAL_LOAN_STATES } from '../constants/status-constants.js'
import TransactionLoanController from './transaction-loan-controller.js'
import NotificationController from './notification-controller.js'
import TransactionLoanRepository from '../repositories/transaction-loan-repository.js'

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

      const proposal = await ProposalLoanRepository.getLoanProposalById(userId, id)

      if (proposal) {
        throw new HttpException('Já fez uma proposta para este empréstimo.', StatusCodes.BAD_REQUEST)
      }

      if (loan.Utilizador_ID === userId) {
        throw new HttpException('Não é possível fazer uma proposta para o seu próprio empréstimo.', StatusCodes.BAD_REQUEST)
      }

      if (newStartDate > newEndDate) {
        throw new HttpException('A data de início não pode ser depois da data de fim.', StatusCodes.BAD_REQUEST)
      }

      if (loan.DataInicio < new Date()) {
        throw new HttpException('O empréstimo já começou. Já não é efetuar propostas.', StatusCodes.BAD_REQUEST)
      }

      if (loan.DataFim < new Date()) {
        throw new HttpException('O empréstimo já terminou. Já não é possível efetuar propostas.', StatusCodes.BAD_REQUEST)
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
        throw new HttpException('Empréstimo não encontrado.', StatusCodes.NOT_FOUND)
      }

      console.log(loan)
      console.log(new Date())

      if (loan.Estado === 'Concluído' || loan.DataFim < new Date()) {
        throw new HttpException('Empréstimo já concluído.', StatusCodes.BAD_REQUEST)
      }

      const proposal = await ProposalLoanRepository.getLoanProposalById(userId, id)

      if (!proposal) {
        throw new HttpException('Proposta não encontrada', StatusCodes.NOT_FOUND)
      }

      await ProposalLoanRepository.updateProposalLoanStatus(userId, id, status)

      const notificationMessage = parseInt(status) === PROPOSAL_LOAN_STATES.ACEITE
        ? `A sua proposta para ${loan.Titulo} foi aceite`
        : `A sua proposta para ${loan.Titulo} foi recusada`

      await NotificationController.createNotification({
        message: notificationMessage,
        category: 'Empréstimo',
        userId
      })

      console.log(proposal)

      if (parseInt(status) === PROPOSAL_LOAN_STATES.ACEITE) {
        try {
          const existingTransaction = await TransactionLoanRepository.getLoanTransactionById(id, userId)

          if (!existingTransaction) {
            try {
              await TransactionLoanController.createTransactionLoan(
                proposal.NovoValor,
                userId,
                id,
                proposal.NovaDataInicio,
                proposal.NovaDataFim
              )

              await LoanRepository.updateLoanStatus(parseInt(id), LOAN_STATES.CONCLUIDO)
            } catch (transactionError) {
              console.error('ERRO NA TRANSAÇÃO:', transactionError.message)

              // Reverte o status da proposta em caso de erro
              await ProposalLoanRepository.updateProposalLoanStatus(userId, id, PROPOSAL_LOAN_STATES.DISPONIVEL)
            }
          }
        } catch (error) {
          console.error('Erro ao verificar/processar transação:', error)
        }
      }

      return response(res, true, StatusCodes.OK, 'Proposta atualizada')
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao atualizar a proposta. Tente novamente mais tarde.')
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
