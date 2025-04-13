import { StatusCodes } from 'http-status-codes'

import { handleError, HttpException } from '../utils/error-handler.js'
import response from '../utils/response.js'
import TransactionSaleRepository from '../repositories/transaction-sale-repository.js'
import SaleRepository from '../repositories/sale-repository.js'
import { SALE_STATES } from '../constants/status-constants.js'

class TransactionSaleController {
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
