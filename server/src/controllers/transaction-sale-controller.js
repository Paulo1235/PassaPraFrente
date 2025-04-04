import StatusCodes from 'http-status-codes'

import { ErrorApplication } from '../utils/error-handler.js'
import { response } from '../utils/response.js'
import { TransactionSaleRepository } from '../repositories/transaction-sale-repository.js'

export class TransactionSaleController {
  static async createTransactionSale (req, res) {
    const data = req.body

    try {
      const transaction = await TransactionSaleRepository.createTransactionSale(data.valorFinal, data.nota)

      response(res, true, StatusCodes.OK, transaction)
    } catch (error) {
      if (error instanceof ErrorApplication) {
        response(res, false, error.statusCodes, error.message)
      } else {
        console.error('Internal error: ', error.message)
        response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao criar a transação.')
      }
    }
  }

  static async getAllSaleTransactions (req, res) {
    try {
      const transactions = await TransactionSaleRepository.getAllSaleTransactions()

      response(res, true, StatusCodes.OK, transactions)
    } catch (error) {
      console.error('Erro ao obter transações: ', error.message)
      response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao encontrar as transações.')
    }
  }

  static async getSaleTransactionById (req, res) {
    const { id } = req.params

    try {
      const transaction = await TransactionSaleRepository.getSaleTransactionById(id)

      response(res, true, StatusCodes.OK, transaction)
    } catch (error) {
      if (error instanceof ErrorApplication) {
        response(res, false, error.statusCodes, error.message)
      } else {
        console.error('Erro ao obter transação: ', error.message)
        response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao encontrar a transação.')
      }
    }
  }
}
