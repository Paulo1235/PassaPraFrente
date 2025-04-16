import { StatusCodes } from 'http-status-codes'

import response from '../utils/response.js'
import { handleError } from '../utils/error-handler.js'
import EntryGiveawayRepository from '../repositories/entry-giveaway-repository.js'
import GiveawayRepository from '../repositories/giveaway-repository.js'

class EntryGiveawayController {
  static async createEntryGiveaway (req, res) {
    const { giveawayId } = req.params
    const userId = req.user.Utilizador_ID

    const entryDate = new Date().toISOString()

    const data = {
      giveawayId,
      userId,
      entryDate
    }

    try {
      const giveaway = await GiveawayRepository.getGiveawayById(giveawayId)

      if (!giveaway) {
        return response(res, false, StatusCodes.NOT_FOUND, 'Sorteio não encontrado.')
      }

      if (giveaway.DataFim < new Date()) {
        return response(res, false, StatusCodes.BAD_REQUEST, 'O sorteio já terminou. Já não é possível inscrever-se.')
      }

      const existingEntry = await EntryGiveawayRepository.getEntryGiveawayById(giveawayId, userId)

      if (existingEntry) {
        return response(res, false, StatusCodes.BAD_REQUEST, 'Já está inscrito neste sorteio.')
      }

      await EntryGiveawayRepository.createEntryGiveaway(data)

      return response(res, true, StatusCodes.CREATED, 'Inscrição criada com sucesso.')
    } catch (error) {
      handleError(res, error, 'Erro ao criar a inscrição no sorteio. Tente novamente mais tarde.')
    }
  }

  static async getEntryGiveawayById (req, res) {
    const { giveawayId } = req.params
    const userId = req.user.Utilizador_ID

    try {
      const giveaway = await EntryGiveawayRepository.getEntryGiveawayById(giveawayId, userId)

      if (!giveaway) {
        return response(res, false, StatusCodes.NOT_FOUND, 'Inscrição não encontrada.')
      }

      return response(res, true, StatusCodes.OK, giveaway)
    } catch (error) {
      handleError(res, error, 'Erro ao obter a inscrição no sorteio. Tente novamente mais tarde.')
    }
  }

  static async getAllEntryGiveawaysByUserId (req, res) {
    const userId = req.user.Utilizador_ID

    try {
      const entryGiveaways = await EntryGiveawayRepository.getAllEntryGiveawaysByUserId(userId)

      return response(res, true, StatusCodes.OK, entryGiveaways)
    } catch (error) {
      handleError(res, error, 'Erro ao obter as inscrições no sorteio. Tente novamente mais tarde.')
    }
  }

  static getAllEntryGiveawaysByGiveaway = async (req, res) => {
    const { giveawayId } = req.params

    try {
      const entryGiveaways = await EntryGiveawayRepository.getAllEntryGiveawaysByGiveaway(giveawayId)

      return response(res, true, StatusCodes.OK, entryGiveaways)
    } catch (error) {
      handleError(res, error, 'Erro ao obter as inscrições no sorteio. Tente novamente mais tarde.')
    }
  }
}

export default EntryGiveawayController
