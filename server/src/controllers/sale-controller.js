import StatusCodes from 'http-status-codes'

import { ErrorApplication } from '../utils/error-handler.js'
import { response } from '../utils/response.js'
import { SaleRepository } from '../repositories/sale-repository.js'
import { IdService } from '../services/id-service.js'

export class SaleController {
  static async createSale (req, res) {
    const userId = req.user.Utilizador_ID
    const data = req.body

    const fullData = {
      data,
      userId
    }

    console.log(fullData)

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
        response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao encontrar a venda.')
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
      const sales = await SaleRepository.getAvailableSales()

      response(res, true, StatusCodes.OK, sales)
    } catch (error) {
      console.error('Erro ao obter vendas disponíveis: ', error.message)
      response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao obter as vendas disponíveis.')
    }
  }

  static async updateSale (req, res) {
    const { id } = req.params
    const data = req.body

    try {
      const existingSale = await SaleRepository.getSaleById(id)

      if (!existingSale) {
        throw new ErrorApplication('Venda não encontrada.', StatusCodes.NOT_FOUND)
      }

      const updatedData = {
        title: data.title || existingSale.Titulo,
        description: data.description || existingSale.Descricao,
        value: data.value || existingSale.Valor
      }

      await SaleRepository.updateSale(updatedData, id)

      response(res, true, StatusCodes.OK, 'Venda atualizada com sucesso.')
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

      const stateId = await IdService.getStateById(status)
      if (!stateId) {
        throw new ErrorApplication('Estado inválido.', StatusCodes.BAD_REQUEST)
      }

      await SaleRepository.updateSaleStatus(id, stateId)

      response(res, true, StatusCodes.OK, 'Estado da venda atualizado.')
    } catch (error) {
      if (error instanceof ErrorApplication) {
        response(res, false, error.statusCodes, error.message)
      } else {
        console.error('Internal error: ', error.message)
        response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao atualizar o estado da venda. Tente novamente mais tarde.')
      }
    }
  }
}
