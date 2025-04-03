import StatusCodes from 'http-status-codes'

import { ErrorApplication } from '../utils/error-handler.js'
import { response } from '../utils/response.js'
import { SaleRepository } from '../repositories/sale-repository.js'

export class SaleController {
  static async createSale (req, res) {
    const userId = req.user.Utilizador_ID
    const saleData = req.body

    const fullData = {
      saleData,
      userId
    }

    try {
      await SaleRepository.createSale(fullData)

      response(res, true, StatusCodes.OK, 'Venda criada com sucesso')
    } catch (error) {
      console.error('Internal error: ', error.message)
      response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao criar a venda.')
    }
  }

  static async getSaleById (req, res) {
    const { id } = req.params
    try {
      const sale = await SaleRepository.getSaleById(id)

      if (!sale) {
        throw new ErrorApplication('Venda não encontrada.', StatusCodes.NOT_FOUND)
      }

      response(res, true, StatusCodes.OK, sale)
    } catch (error) {
      if (error instanceof ErrorApplication) {
        response(res, false, error.statusCodes, error.message)
      } else {
        console.error('Erro ao obter venda: ', error.message)
        response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao encontrar uma venda.')
      }
    }
  }

  static async getAllSales (req, res) {
    try {
      const sales = await SaleRepository.getAllSales()

      response(res, true, StatusCodes.OK, sales)
    } catch (error) {
      console.error('Erro ao obter vendas: ', error.message)
      response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao encontrar as vendas.')
    }
  }

  static async getAvailableSales (req, res) {
    try {
      const sale = await SaleRepository.getAvailableSales()

      response(res, true, StatusCodes.OK, sale)
    } catch (error) {
      console.error('Erro ao obter vendas disponíveis: ', error.message)
      response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao obter das vendas disponíveis.')
    }
  }

  static async updateSale (req, res) {
    const data = req.body
    try {
      const sale = await SaleRepository.updateSale(data)

      if (!sale) {
        throw new ErrorApplication('Não foi possível atualizar a venda', StatusCodes.BAD_REQUEST)
      }

      response(res, true, StatusCodes.OK, sale)
    } catch (error) {
      if (error instanceof ErrorApplication) {
        response(res, false, error.statusCodes, error.message)
      } else {
        console.error('Erro ao atualizar a venda: ', error.message)
        response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao atualizar a venda.')
      }
    }
  }

  static async getUserSales (req, res) {
    const id = req.user.Utilizador_ID
    try {
      const sales = await SaleRepository.getUserSales(id)

      response(res, true, StatusCodes.OK, sales)
    } catch (error) {
      console.error('Erro ao obter vendas do utilizador:', error.message)
      response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro a obter as suas vendas. Tente novamente mais tarde.')
    }
  }

  static async updateSaleStatus (req, res) {
    const { status } = req.body
    const { id } = req.params

    try {
      const sale = await SaleRepository.getSaleById(id)

      if (!sale) {
        throw new ErrorApplication('Não foi possível encontrar a venda.', StatusCodes.NOT_FOUND)
      }

      await SaleRepository.updateSaleStatus(id, status)

      response(res, true, StatusCodes.OK, 'Estado da venda atualizado.')
    } catch (error) {
      if (error instanceof ErrorApplication) {
        response(res, false, error.statusCodes, error.message)
      } else {
        console.error('Internal error: ', error.message)
        response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao atualizar o estado a venda. Tente novamente mais tarde.')
      }
    }
  }
}
