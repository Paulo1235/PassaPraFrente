import { StatusCodes } from 'http-status-codes'

import { handleError, HttpException } from '../utils/error-handler.js'
import response from '../utils/response.js'
import SaleRepository from '../repositories/sale-repository.js'
import IdService from '../services/id-service.js'

class SaleController {
  static async createSale (req, res) {
    const userId = req.user.Utilizador_ID
    const data = req.body

    try {
      await SaleRepository.createSale({ data, userId })

      response(res, true, StatusCodes.CREATED, 'Venda criada com sucesso')
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao criar a venda.')
    }
  }

  static async getSaleById (req, res) {
    const { id } = req.params
    try {
      const sale = await SaleRepository.getSaleById(id)

      if (!sale) {
        throw new HttpException('Venda não encontrada.', StatusCodes.NOT_FOUND)
      }

      return response(res, true, StatusCodes.OK, sale)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar a venda.')
    }
  }

  static async getAllSales (req, res) {
    try {
      const sales = await SaleRepository.getAllSales()

      return response(res, true, StatusCodes.OK, sales)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar as vendas.')
    }
  }

  static async getAvailableSales (req, res) {
    try {
      const sales = await SaleRepository.getAvailableSales()

      return response(res, true, StatusCodes.OK, sales)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar as vendas disponíveis.')
    }
  }

  static async updateSale (req, res) {
    const { id } = req.params
    const data = req.body

    try {
      const existingSale = await SaleRepository.getSaleById(id)

      if (!existingSale) {
        throw new HttpException('Venda não encontrada.', StatusCodes.NOT_FOUND)
      }

      const updatedData = {
        title: data.title || existingSale.Titulo,
        description: data.description || existingSale.Descricao,
        value: data.value || existingSale.Valor,
        itemId: existingSale.Artigo_ID,
        category: data.category || existingSale.NomeCategoria,
        condition: data.condition || existingSale.Condicao
      }

      await SaleRepository.updateSale(updatedData, id)

      return response(res, true, StatusCodes.OK, 'Venda atualizada com sucesso.')
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao atualizar a venda.')
    }
  }

  static async getUserSales (req, res) {
    const id = req.user.Utilizador_ID

    try {
      const sales = await SaleRepository.getUserSales(id)

      response(res, true, StatusCodes.OK, sales)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar as vendas do utilizador.')
    }
  }

  static async updateSaleStatus (req, res) {
    const { status } = req.body
    const { id } = req.params

    try {
      const sale = await SaleRepository.getSaleById(id)

      if (!sale) {
        throw new HttpException('Não foi possível encontrar a venda.', StatusCodes.NOT_FOUND)
      }

      const stateId = await IdService.getStateById(status)

      if (!stateId) {
        throw new HttpException('Estado inválido.', StatusCodes.BAD_REQUEST)
      }

      await SaleRepository.updateSaleStatus(id, stateId)

      return response(res, true, StatusCodes.OK, 'Estado da venda atualizado.')
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao atualizar o estado da venda.')
    }
  }
}

export default SaleController
