import { StatusCodes } from 'http-status-codes'

import GiveawayRepository from '../repositories/giveaway-repository.js'
import response from '../utils/response.js'
import WinnerGiveawayRepository from '../repositories/winner-giveaway-repository.js'
import { handleError, HttpException } from '../utils/error-handler.js'
import EntryGiveawayRepository from '../repositories/entry-giveaway-repository.js'
import convertUTCToLocalISOString from '../utils/date.js'

class WinnerGiveawayController {
  static async createWinnerGiveaway (req, res) {
    const { giveawayId } = req.params

    try {
      const winnerExists = await WinnerGiveawayRepository.getWinnerGiveawayById(giveawayId)

      if (winnerExists) {
        return response(res, false, StatusCodes.BAD_REQUEST, 'Vencedor do sorteio já existe.')
      }

      const giveaway = await GiveawayRepository.getGiveawayById(giveawayId)

      if (!giveaway) {
        return response(res, false, StatusCodes.NOT_FOUND, 'Giveaway não encontrado.')
      }

      const winnerId = await WinnerGiveawayController.drawWinnerGiveaway(giveawayId)

      const data = {
        giveawayId,
        userId: winnerId
      }

      await WinnerGiveawayRepository.createWinnerGiveaway(data)

      return response(res, true, StatusCodes.CREATED, 'Vencedor do sorteio criado com sucesso.')
    } catch (error) {
      handleError(res, error, 'Erro ao criar o vencedor do sorteio. Tente novamente mais tarde.')
    }
  }

  static async getWinnerGiveawayById (req, res) {
    const { giveawayId } = req.params

    try {
      const giveaway = await GiveawayRepository.getGiveawayById(giveawayId)

      if (!giveaway) {
        return response(res, false, StatusCodes.NOT_FOUND, 'Giveaway não encontrado.')
      }

      const winnerGiveaway = await WinnerGiveawayRepository.getWinnerGiveawayById(giveawayId)

      if (!winnerGiveaway) {
        return response(res, false, StatusCodes.NOT_FOUND, 'Vencedor do sorteio não encontrado.')
      }

      return response(res, true, StatusCodes.OK, winnerGiveaway)
    } catch (error) {
      handleError(res, error, 'Erro ao encontrar o vencedor do sorteio.')
    }
  }

  static async getAllWinnersGiveawaysByUserId (req, res) {
    const { userId } = req.params

    try {
      const winnersGiveaways = await WinnerGiveawayRepository.getAllWinnersGiveawaysByUserId(userId)

      return response(res, true, StatusCodes.OK, winnersGiveaways)
    } catch (error) {
      handleError(res, error, 'Erro ao encontrar todos os vencedores dos sorteios.')
    }
  }

  static async drawWinnerGiveaway (giveawayId) {
    const giveaway = await GiveawayRepository.getGiveawayById(giveawayId)

    if (!giveaway) {
      throw new HttpException('Giveaway não encontrado.', StatusCodes.NOT_FOUND)
    }

    const giveawayEndDate = new Date(giveaway.DataFim)

    const localDate = convertUTCToLocalISOString(new Date())

    const currentLocalDate = new Date(localDate)

    if (giveawayEndDate < currentLocalDate) {
      const entries = await EntryGiveawayRepository.getAllEntriesGiveaway(giveawayId)

      if (entries.length === 0) {
        throw new HttpException('Não há inscrições para este sorteio.', StatusCodes.NOT_FOUND)
      }

      const randomIndex = Math.floor(Math.random() * entries.length)

      const winnerId = entries[randomIndex].UtilizadorUtilizador_ID

      return winnerId
    } else {
      throw new HttpException('O sorteio ainda não terminou.', StatusCodes.BAD_REQUEST)
    }
  }
}

export default WinnerGiveawayController
