import { StatusCodes } from 'http-status-codes'

import { handleError, HttpException } from '../utils/error-handler.js'
import response from '../utils/response.js'
import { LOAN_STATES, PROPOSAL_LOAN_STATES } from '../constants/status-constants.js'
import TransactionLoanRepository from '../repositories/transaction-loan-repository.js'
import LoanRepository from '../repositories/loan-repository.js'
import ProposalLoanRepository from '../repositories/proposal-loan-repository.js'
import NotificationController from './notification-controller.js'
import { FRONTEND_URL } from '../../config.js'

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
      handleError(res, error, 'Ocorreu um erro ao criar a transação.')
    }
  }

  static async createTransactionLoan (finalValue, userId, id, finalNewDate, finalEndDate) {
    try {
      const existsTransaction = await TransactionLoanRepository.getLoanTransactionById(id, userId)

      if (existsTransaction) {
        return
      }

      const transaction = await TransactionLoanRepository.createTransactionLoan(finalValue, userId, id, finalNewDate, finalEndDate)

      if (transaction) {
        await LoanRepository.updateLoanStatus(parseInt(id), LOAN_STATES.CONCLUIDO)

        const loan = await LoanRepository.getLoanById(id)

        const notificationData = {
          message: `Avalie o vendedor do empréstimo: ${loan.Titulo}`,
          userId,
          category: 'Empréstimo',
          link: `${FRONTEND_URL}/review/user/loan/${transaction.TransacaoEmprestimo_ID}`
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

  static async createReviewTransactionLoan (req, res) {
    const review = req.body.review

    const userId = req.user.Utilizador_ID
    const { id } = req.params

    const data = {
      review,
      userId,
      id
    }

    try {
      const transaction = await TransactionLoanRepository.getLoanTransactionByTransactionId(id)

      if (!transaction) {
        throw new HttpException('Transação de empréstimo não existe.', StatusCodes.NOT_FOUND)
      }

      if (userId !== transaction.PropostaEmprestimoUtilizador_ID) {
        throw new HttpException('Não pode fazer review deste empréstimo', StatusCodes.BAD_REQUEST)
      }

      if (transaction.Nota !== 0) {
        throw new HttpException('Já efetuou review deste empréstimo.', StatusCodes.BAD_REQUEST)
      }

      await TransactionLoanRepository.updateLoanReview(data)

      return response(res, true, StatusCodes.CREATED, 'Review do empréstimo criada com sucesso.')
    } catch (error) {
      handleError(res, error, 'Não foi possível efetuar a avaliação do empréstimo.')
    }
  }
}

export default TransactionLoanController
