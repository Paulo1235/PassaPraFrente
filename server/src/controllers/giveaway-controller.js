import { StatusCodes } from 'http-status-codes'

import GiveawayRepository from '../repositories/giveaway-repository.js'
import { handleError, HttpException } from '../utils/error-handler.js'
import response from '../utils/response.js'
import IdService from '../services/id-service.js'

class GiveawayController {
  static async createGiveaway (req, res) {
    const userId = req.user.Utilizador_ID
    const data = req.body

    try {
      if (new Date(data.startDate) >= new Date(data.endDate)) {
        throw new HttpException('A data de início deve ser anterior à data de fim.', StatusCodes.BAD_REQUEST)
      }

      await GiveawayRepository.createGiveaway({ data, userId })

      return response(res, true, StatusCodes.CREATED, 'Giveaway criado com sucesso.')
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao criar o giveaway. Tente novamente mais tarde.')
    }
  }

  static async getGiveawayById (req, res) {
    const { id } = req.params

    try {
      const giveaway = await GiveawayRepository.getGiveawayById(id)

      if (!giveaway) {
        throw new HttpException('Giveaway não encontrado.', StatusCodes.NOT_FOUND)
      }

      return response(res, true, StatusCodes.OK, giveaway)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar o giveaway.')
    }
  }

  static async getAllGiveaways (req, res) {
    try {
      const giveaways = await GiveawayRepository.getAllGiveaways()

      return response(res, true, StatusCodes.OK, giveaways)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar os giveaways.')
    }
  }

  static async getAvailableGiveaways (req, res) {
    try {
      const giveaways = await GiveawayRepository.getAvailableGiveaways()

      return response(res, true, StatusCodes.OK, giveaways)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar os giveaways disponíveis.')
    }
  }

  static async getPendingGiveaways (req, res) {
    try {
      const giveaways = await GiveawayRepository.getPendingGiveaways()

      return response(res, true, StatusCodes.OK, giveaways)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar os giveaways em análise.')
    }
  }

  static async updateGiveaway (req, res) {
    const { id } = req.params
    const data = req.body

    try {
      const existingGiveaway = await GiveawayRepository.getGiveawayById(id)

      if (!existingGiveaway) {
        throw new HttpException('Giveaway não encontrado.', StatusCodes.NOT_FOUND)
      }

      const updatedData = {
        startDate: data.startDate || existingGiveaway.DataInicio,
        endDate: data.endDate || existingGiveaway.DataFim,
        title: data.title || existingGiveaway.Titulo,
        description: data.description || existingGiveaway.Descricao,
        condition: data.condition || existingGiveaway.Condicao,
        category: data.category || existingGiveaway.NomeCategoria,
        itemId: existingGiveaway.Artigo_ID
      }

      await GiveawayRepository.updateGiveaway(id, updatedData)

      return response(res, true, StatusCodes.OK, 'Giveaway atualizado com sucesso.')
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao atualizar o giveaway.')
    }
  }

  static async getUserGiveaways (req, res) {
    const userId = req.user.Utilizador_ID

    try {
      const giveaways = await GiveawayRepository.getUserGiveaways(userId)

      return response(res, true, StatusCodes.OK, giveaways)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar os giveaways do utilizador.')
    }
  }

  static async updateGiveawayStatus (req, res) {
    const { status } = req.body
    const { id } = req.params
    try {
      const giveaway = await GiveawayRepository.getGiveawayById(id)

      if (!giveaway) {
        throw new HttpException('Não foi possível encontrar o sorteio.', StatusCodes.NOT_FOUND)
      }

      const stateId = await IdService.getStateById(status)
      if (!stateId) {
        throw new HttpException('Estado inválido.', StatusCodes.BAD_REQUEST)
      }

      await GiveawayRepository.updateGiveawayStatus(id, stateId)

      return response(res, true, StatusCodes.OK, 'Estado do sorteio atualizado.')
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao atualizar o estado do sorteio.')
    }
  }
}
export default GiveawayController
