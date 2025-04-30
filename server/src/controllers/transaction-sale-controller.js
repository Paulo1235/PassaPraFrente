import { StatusCodes } from 'http-status-codes'

import { handleError, HttpException } from '../utils/error-handler.js'
import response from '../utils/response.js'
import TransactionSaleRepository from '../repositories/transaction-sale-repository.js'
import SaleRepository from '../repositories/sale-repository.js'
import { PROPOSAL_SALE_STATES, SALE_STATES } from '../constants/status-constants.js'
import ProposalSaleRepository from '../repositories/proposal-sale-repository.js'
import NotificationController from './notification-controller.js'
import { FRONTEND_URL } from '../../config.js'

class TransactionSaleController {
  static async createDirectTransactionSale (req, res) {
    const userId = req.user.Utilizador_ID
    const { id } = req.params

    try {
      const sale = await SaleRepository.getSaleById(id)

      if (!sale) {
        throw new HttpException('A venda não existe.', StatusCodes.NOT_FOUND)
      }

      if (sale.Utilizador_ID === userId) {
        throw new HttpException('Não pode comprar a sua própria venda.', StatusCodes.BAD_REQUEST)
      }

      if (sale.Estado === 'Concluído' || sale.Estado === 'Em análise' || sale.Estado === 'Rejeitado') {
        throw new HttpException('Não pode criar uma transação nesta venda.', StatusCodes.BAD_REQUEST)
      }

      const proposal = await ProposalSaleRepository.createProposalSale(sale.Valor, userId, id, PROPOSAL_SALE_STATES.ACEITE)

      if (proposal) {
        await TransactionSaleController.createTransactionSale(sale.Valor, userId, id)
      }

      return response(res, true, StatusCodes.CREATED, 'Transação criada com sucesso.')
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao criar a transação')
    }
  }

  static async createTransactionSale (finalValue, userId, id) {
    try {
      const transaction = await TransactionSaleRepository.createTransactionSale(finalValue, userId, id)

      if (transaction) {
        await SaleRepository.updateSaleStatus(parseInt(id), SALE_STATES.CONCLUIDO)

        const sale = await SaleRepository.getSaleById(id)

        const notificationData = {
          message: `Avalie o vendedor da venda: ${sale.Titulo}`,
          userId,
          category: 'Venda',
          link: `${FRONTEND_URL}/review/user/sale/${transaction.TransacaoVenda_ID}`
        }

        NotificationController.createNotification(notificationData)
      }

      return transaction
    } catch (error) {
      throw new HttpException('Erro ao criar a transação', StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }

  static async getAllSaleTransactions (req, res) {
    try {
      const transactions = await TransactionSaleRepository.getAllSaleTransactions()

      return response(res, true, StatusCodes.OK, transactions)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar as transações.')
    }
  }

  static async getSaleTransactionById (req, res) {
    const { id, userId } = req.params

    try {
      const transaction = await TransactionSaleRepository.getSaleTransactionById(id, userId)

      if (!transaction) {
        throw new HttpException('Transação não encontrada!', StatusCodes.NOT_FOUND)
      }

      return response(res, true, StatusCodes.OK, transaction)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar a transação.')
    }
  }

  static async createReviewTransactionSale (req, res) {
    const review = req.body.review

    const userId = req.user.Utilizador_ID
    const { id } = req.params

    const data = {
      review,
      userId,
      id
    }

    try {
      const transaction = await TransactionSaleRepository.getSaleTransactionByTransactionId(id)

      if (!transaction) {
        throw new HttpException('Transação de venda não existe.', StatusCodes.NOT_FOUND)
      }

      if (userId !== transaction.PropostaVendaUtilizador_ID) {
        throw new HttpException('Não pode fazer review desta venda', StatusCodes.UNAUTHORIZED)
      }

      if (transaction.Nota !== 0) {
        throw new HttpException('Já efetuou review desta venda.', StatusCodes.BAD_REQUEST)
      }

      await TransactionSaleRepository.updateSaleReview(data)

      return response(res, true, StatusCodes.CREATED, 'Review da venda criada com sucesso.')
    } catch (error) {
      handleError(res, error, 'Não foi possível efetuar a avaliação da venda.')
    }
  }
}

export default TransactionSaleController
