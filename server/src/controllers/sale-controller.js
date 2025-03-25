import StatusCodes from 'http-status-codes'

import { ErrorApplication } from '../utils/error-handler.js'
import { response } from '../utils/response.js'
import { SaleRepository } from '../repositories/sale-repository.js'

export class SaleController {
  static async createSale (req, res) {
    const data = req.body

    try {
      const sale = await SaleRepository.createSale(data)

      if (!sale) {
        throw new ErrorApplication('Não foi possível criar venda.', StatusCodes.NOT_FOUND)
      }

      response(res, true, StatusCodes.OK, sale)
    } catch (error) {
      if (error instanceof ErrorApplication) {
        response(res, false, error.statusCodes, error.message)
      } else {
        console.error('Internal error: ', error.message)
        response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while finding an user')
      }
    }
  }

  static async getSaleById (req, res) {
    const { id } = req.params

    try {
      const sale = await SaleRepository.getSaleById(id)

      if (!sale) {
        throw new ErrorApplication('Sale not found', StatusCodes.NOT_FOUND)
      }

      response(res, true, StatusCodes.OK, sale)
    } catch (error) {
      if (error instanceof ErrorApplication) {
        response(res, false, error.statusCodes, error.message)
      } else {
        console.error('Internal error: ', error.message)
        response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while finding an user')
      }
    }
  }

  static async getAllSales (req, res) {
    try {
      const sale = await SaleRepository.getAllSales()

      if (!sale) {
        throw new ErrorApplication('Não foi possível obter as vendas', StatusCodes.NOT_FOUND)
      }

      response(res, true, StatusCodes.OK, sale)
    } catch (error) {
      if (error instanceof ErrorApplication) {
        response(res, false, error.statusCodes, error.message)
      } else {
        console.error('Internal error: ', error.message)
        response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while finding an user')
      }
    }
  }

  static async getAvailableSales (req, res) {
    try {
      const sale = await SaleRepository.getAvailableSales()

      if (!sale) {
        throw new ErrorApplication('Não foi possível obter as vendas disponiveis', StatusCodes.NOT_FOUND)
      }

      response(res, true, StatusCodes.OK, sale)
    } catch (error) {
      if (error instanceof ErrorApplication) {
        response(res, false, error.statusCodes, error.message)
      } else {
        console.error('Internal error: ', error.message)
        response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while finding an user')
      }
    }
  }

  static async updateSale (req, res) {
    try {
      const data = req.body
      const sale = await SaleRepository.updateSale(data)

      if (!sale) {
        throw new ErrorApplication('Não foi possível atualizar a venda', StatusCodes.NOT_FOUND)
      }

      response(res, true, StatusCodes.OK, sale)
    } catch (error) {
      if (error instanceof ErrorApplication) {
        response(res, false, error.statusCodes, error.message)
      } else {
        console.error('Internal error: ', error.message)
        response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while finding an user')
      }
    }
  }

  static async getUserSales (req, res) {
    try {
      const { id } = req.params
      const sale = await SaleRepository.getUserSales(id)

      if (!sale) {
        throw new ErrorApplication('Não foi possível obter as vendas do utilizador', StatusCodes.NOT_FOUND)
      }

      response(res, true, StatusCodes.OK, sale)
    } catch (error) {
      if (error instanceof ErrorApplication) {
        response(res, false, error.statusCodes, error.message)
      } else {
        console.error('Internal error: ', error.message)
        response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while finding an user')
      }
    }
  }
}
