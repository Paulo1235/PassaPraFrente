import { StatusCodes } from 'http-status-codes'

import GiveawayRepository from '../repositories/giveaway-repository.js'
import response from '../utils/response.js'
import WinnerGiveawayRepository from '../repositories/winner-giveaway-repository.js'
import { handleError, HttpException } from '../utils/error-handler.js'
import EntryGiveawayRepository from '../repositories/entry-giveaway-repository.js'
import convertUTCToLocalISOString from '../utils/date.js'
import { FRONTEND_URL } from '../../config.js'
import NotificationController from './notification-controller.js'

class WinnerGiveawayController {
  static async createWinnerGiveaway (req, res) {
    const { id } = req.params

    try {
      const winnerExists = await WinnerGiveawayRepository.getWinnerGiveawayById(id)

      if (winnerExists) {
        return response(res, false, StatusCodes.BAD_REQUEST, 'Vencedor do sorteio já existe.')
      }

      const giveaway = await GiveawayRepository.getGiveawayById(id)

      if (!giveaway) {
        return response(res, false, StatusCodes.NOT_FOUND, 'Giveaway não encontrado.')
      }

      const winnerId = await WinnerGiveawayController.drawWinnerGiveaway(id)

      const data = {
        id,
        userId: winnerId
      }

      const notificationData = {
        message: `Avalie o vendedor do sorteio: ${giveaway.Titulo}`,
        winnerId,
        category: 'Empréstimo',
        link: `${FRONTEND_URL}/review/user/giveaway/${giveaway.Sorteio_ID}`
      }

      NotificationController.createNotification(notificationData)

      await WinnerGiveawayRepository.createWinnerGiveaway(data)

      return response(res, true, StatusCodes.CREATED, 'Vencedor do sorteio criado com sucesso.')
    } catch (error) {
      handleError(res, error, 'Erro ao criar o vencedor do sorteio. Tente novamente mais tarde.')
    }
  }

  static async getWinnerGiveawayById (req, res) {
    const { id } = req.params

    try {
      const giveaway = await GiveawayRepository.getGiveawayById(id)

      if (!giveaway) {
        return response(res, false, StatusCodes.NOT_FOUND, 'Giveaway não encontrado.')
      }

      const winnerGiveaway = await WinnerGiveawayRepository.getWinnerGiveawayById(id)

      if (!winnerGiveaway) {
        return response(res, false, StatusCodes.NOT_FOUND, 'Vencedor do sorteio não encontrado.')
      }

      return response(res, true, StatusCodes.OK, winnerGiveaway)
    } catch (error) {
      handleError(res, error, 'Erro ao encontrar o vencedor do sorteio.')
    }
  }

  static async getAllWinnersGiveaways (req, res) {
    try {
      const giveaways = await WinnerGiveawayRepository.getAllWinnersGiveaways()

      return response(res, true, StatusCodes.OK, giveaways)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar os vencedores dos sorteios.')
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

  static async createReviewWinnerGiveaway (req, res) {
    const userId = req.user.Utilizador_ID
    const { id } = req.params

    const review = req.body.review

    try {
      const giveaway = await GiveawayRepository.getGiveawayById(id)

      if (!giveaway) {
        throw new HttpException('Sorteio não encontrado.', StatusCodes.NOT_FOUND)
      }

      const winnerGiveaway = await WinnerGiveawayRepository.getWinnerGiveawayById(id)

      if (!winnerGiveaway) {
        throw new HttpException('O sorteio ainda não tem vencedor', StatusCodes.NOT_FOUND)
      }

      if (userId !== winnerGiveaway.InscricaoSorteioUtilizadorUtilizador_ID) {
        throw new HttpException('Não pode fazer a review deste sorteio. Não ganhou o sorteio.', StatusCodes.UNAUTHORIZED)
      }

      if (winnerGiveaway.Nota !== 0) {
        throw new HttpException('Já fez review deste sorteio.', StatusCodes.BAD_REQUEST)
      }

      await WinnerGiveawayRepository.updateGiveawayReview(id, review)

      return response(res, true, StatusCodes.OK, 'Review do sorteio efetuada com sucesso.')
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao efetuar a avaliação do sorteio.')
    }
  }
}

export default WinnerGiveawayController
