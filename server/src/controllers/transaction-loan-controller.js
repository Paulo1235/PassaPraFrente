import { StatusCodes } from 'http-status-codes'

import { handleError, HttpException } from '../utils/error-handler.js'
import response from '../utils/response.js'
import { LOAN_STATES, PROPOSAL_LOAN_STATES } from '../constants/status-constants.js'
import TransactionLoanRepository from '../repositories/transaction-loan-repository.js'
import LoanRepository from '../repositories/loan-repository.js'
import ProposalLoanRepository from '../repositories/proposal-loan-repository.js'
import NotificationController from './notification-controller.js'

class TransactionLoanController {
  static async createDirectTransactionLoan (req, res) {
    const userId = req.user.Utilizador_ID
    const { id } = req.params

    try {
      const loan = await LoanRepository.getLoanById(id)

      if (!loan) {
        throw new HttpException('O empréstimo não existe.', StatusCodes.NOT_FOUND)
      }

      if (loan.Utilizador_ID === userId) {
        throw new HttpException('Não pode pedir o seu próprio empréstimo.', StatusCodes.BAD_REQUEST)
      }

      if (loan.Estado === 'Concluído') {
        throw new HttpException('Já não pode criar uma transação neste empréstimo.', StatusCodes.BAD_REQUEST)
      }

      const proposal = await ProposalLoanRepository.createProposalLoan(userId, id, loan.Valor, loan.DataInicio, loan.DataFim, PROPOSAL_LOAN_STATES.ACEITE)

      if (proposal) {
        await TransactionLoanController.createTransactionLoan(loan.Valor, userId, id, loan.DataInicio, loan.DataFim)
      }

      return response(res, true, StatusCodes.CREATED, 'Transação criada com sucesso.')
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao criar a transação')
    }
  }

  static async createTransactionLoan (finalValue, userId, id, finalNewDate, finalEndDate) {
    try {
      const transaction = await TransactionLoanRepository.createTransactionLoan(finalValue, userId, id, finalNewDate, finalEndDate)

      if (transaction) {
        await LoanRepository.updateLoanStatus(id, LOAN_STATES.CONCLUIDO)

        const loan = await LoanRepository.getLoanById(id)

        const notificationData = {
          message: `Avalie o vendedor do empréstimo ${loan.Titulo}`,
          userId
        }

        NotificationController.createNotification(notificationData)
      }

      return transaction
    } catch (error) {
      throw new HttpException('Ocorreu um erro ao criar a transação.', StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }

  static async getAllLoanTransactions (req, res) {
    try {
      const transactions = await TransactionLoanRepository.getAllLoanTransactions()

      return response(res, true, StatusCodes.OK, transactions)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar as transações.')
    }
  }

  static async getLoanTransactionById (req, res) {
    const { id } = req.params

    try {
      const transaction = await TransactionLoanRepository.getLoanTransactionById(id)

      return response(res, true, StatusCodes.OK, transaction)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar a transação.')
    }
  }
}

export default TransactionLoanController
