import StatusCodes from 'http-status-codes'

import { ErrorApplication } from '../utils/error-handler.js'
import { response } from '../utils/response.js'
import { TransationSaleRepository } from '../repositories/transation-sale-repository.js'
import cloudinary from 'cloudinary'

export class TransationSaleController {
  static async createTransationSale (req, res) {
    const data = req.body
    try {
      const item = await TransationSaleRepository.createTransationSale(data)

      response(res, true, StatusCodes.OK, item)
    } catch (error) {
      if (error instanceof ErrorApplication) {
        response(res, false, error.statusCodes, error.message)
      } else {
        console.error('Internal error: ', error.message)
        response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao criar a transação.')
      }
    }
  }

  static async updateProposalSaleStatus (req, res) {
    const data = req.body
    try {
      const sale = await TransationSaleRepository.updateProposalSaleStatus(data)

      response(res, true, StatusCodes.OK, sale)
    } catch (error) {
      if (error instanceof ErrorApplication) {
        response(res, false, error.statusCodes, error.message)
      } else {
        console.error('Erro ao atualizar a transação: ', error.message)
        response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao atualizar a transação.')
      }
    }
  }

  static async getAllTransationSalesProposals (req, res) {
    try {
      const items = await TransationSaleRepository.getAllTransationSalesProposals()

      response(res, true, StatusCodes.OK, items)
    } catch (error) {
      console.error('Erro ao obter transações: ', error.message)
      response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao encontrar as transações.')
    }
  }

  static async getSaleProposalById (req, res) {
    const { id } = req.params
    try {
      const item = await TransationSaleRepository.getSaleProposalById(id)

      response(res, true, StatusCodes.OK, item)
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