import { StatusCodes } from 'http-status-codes'

import { handleError, HttpException } from '../utils/error-handler.js'
import response from '../utils/response.js'
import TransactionSaleRepository from '../repositories/transaction-sale-repository.js'
import SaleRepository from '../repositories/sale-repository.js'
import { SALE_STATES } from '../constants/status-constants.js'
import ProposalSaleRepository from '../repositories/proposal-sale-repository.js'

class TransactionSaleController {
  static async createDirectTransactionSale (req, res) {
    const userId = req.user.Utilizador_ID
    const id = req.params

    try {
      const sale = await SaleRepository.getSaleById(id)

      if (!sale) {
        throw new HttpException('A venda não existe.', StatusCodes.NOT_FOUND)
      }

      if (sale.Utilizador_ID === userId) {
        throw new HttpException('Não pode comprar a sua própria venda.', StatusCodes.BAD_REQUEST)
      }

      const proposal = await ProposalSaleRepository.createProposalSale(sale.Valor, userId, id)

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
        await SaleRepository.updateSaleStatus(id, SALE_STATES.CONCLUIDO)
      }

      return transaction
    } catch (error) {
      throw new HttpException('Ocorreu um erro ao criar a transação.', StatusCodes.INTERNAL_SERVER_ERROR)
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
    const { id } = req.params

    try {
      const transaction = await TransactionSaleRepository.getSaleTransactionById(id)

      return response(res, true, StatusCodes.OK, transaction)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar a transação.')
    }
  }
}

export default TransactionSaleController
