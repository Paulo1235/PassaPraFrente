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

  static async updateGiveaway (req, res) {
    const { id } = req.params
    const data = req.body

    try {
      const existingGiveaway = await GiveawayRepository.getGiveawayById(id)

      if (!existingGiveaway) {
        throw new HttpException('Giveaway não encontrado.', StatusCodes.NOT_FOUND)
      }

      const stateId = await IdService.getStateById(data.state)

      const updatedData = {
        startDate: data.startDate || existingGiveaway.DataInicio,
        endDate: data.endDate || existingGiveaway.DataFim,
        title: data.title || existingGiveaway.Titulo,
        description: data.description || existingGiveaway.Descricao,
        state: stateId || existingGiveaway.Estado_ID
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
}

export default GiveawayController
