import { StatusCodes } from 'http-status-codes'

import { handleError } from '../utils/error-handler.js'
import response from '../utils/response.js'
import TransactionSaleRepository from '../repositories/transaction-sale-repository.js'

class TransactionSaleController {
  static async createTransactionSale (req, res) {
    const data = req.body

    try {
      const transaction = await TransactionSaleRepository.createTransactionSale(data.valorFinal, data.nota)

      return response(res, true, StatusCodes.OK, transaction)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao criar a transação.')
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
