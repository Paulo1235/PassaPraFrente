import { StatusCodes } from 'http-status-codes'

import { handleError, HttpException } from '../utils/error-handler.js'
import response from '../utils/response.js'
import SaleRepository from '../repositories/sale-repository.js'
import IdService from '../services/id-service.js'
import ItemController from './item-controller.js'

class SaleController {
  static async createSale (req, res) {
    const userId = req.user.Utilizador_ID
    const data = req.body

    try {
      const item = await ItemController.createItem(data)

      if (item) {
        await SaleRepository.createSale(item, data, userId)
      }

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

  static async getPendingSales (req, res) {
    try {
      const sales = await SaleRepository.getPendingSales()

      return response(res, true, StatusCodes.OK, sales)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar as vendas em análise.')
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
    const userId = req.user.Utilizador_ID

    try {
      const sales = await SaleRepository.getUserSales(userId)

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

  static async updateSaleImage (req, res) {
    const { id } = req.params
    const { index, thumbnail } = req.body

    try {
      const sale = await SaleRepository.getSaleById(id)

      if (!sale) {
        throw new HttpException('Venda não encontrada', StatusCodes.NOT_FOUND)
      }

      const itemId = sale.Artigo_ID

      const data = {
        itemId,
        index,
        thumbnail
      }

      await ItemController.updateItemPhoto(data)

      return response(res, true, StatusCodes.OK, 'Imagem de venda atualizada com sucesso.')
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao atualizar uma das imagens da venda.')
    }
  }

  static async getNonCompletedSalesByUser (req, res) {
    const userId = req.user.Utilizador_ID

    try {
      const uncompletedSales = await SaleRepository.getNonCompletedSalesByUser(userId)

      return response(res, true, StatusCodes.OK, uncompletedSales)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar as vendas não completas.')
    }
  }

  static async getCompletedSalesByUser (req, res) {
    const userId = req.user.Utilizador_ID

    try {
      const completedSales = await SaleRepository.getCompletedSalesByUser(userId)

      return response(res, true, StatusCodes.OK, completedSales)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar as vendas completas.')
    }
  }
}

export default SaleController
