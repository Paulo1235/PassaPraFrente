import { StatusCodes } from 'http-status-codes'

import GiveawayRepository from '../repositories/giveaway-repository.js'
import { handleError, HttpException } from '../utils/error-handler.js'
import response from '../utils/response.js'
import ItemController from './item-controller.js'
import ItemRepository from '../repositories/item-repository.js'
import { GIVEAWAY_STATES } from '../constants/status-constants.js'
import StateRepository from '../repositories/state-repository.js'

class GiveawayController {
  static async createGiveaway (req, res) {
    const userId = req.user.Utilizador_ID
    const data = req.body

    try {
      if (new Date(data.startDate) >= new Date(data.endDate)) {
        throw new HttpException('A data de início deve ser anterior à data de fim.', StatusCodes.BAD_REQUEST)
      }

      const item = await ItemController.createItem(data)

      if (item) {
        await GiveawayRepository.createGiveaway(item, data, userId)
      }

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

      const giveawayWithPhotos = await GiveawayController.attachPhotosToGiveaway(giveaway)

      return response(res, true, StatusCodes.OK, giveawayWithPhotos)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar o giveaway.')
    }
  }

  static async getAllGiveaways (req, res) {
    try {
      const giveaways = await GiveawayRepository.getAllGiveaways()

      const giveawaysWithPhotos = await GiveawayController.attachFirstPhotoToGiveaways(giveaways)

      return response(res, true, StatusCodes.OK, giveawaysWithPhotos)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar os giveaways.')
    }
  }

  static async getAvailableGiveaways (req, res) {
    try {
      const giveaways = await GiveawayRepository.getAvailableGiveaways()

      const giveawaysWithPhotos = await GiveawayController.attachFirstPhotoToGiveaways(giveaways)

      return response(res, true, StatusCodes.OK, giveawaysWithPhotos)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar os giveaways disponíveis.')
    }
  }

  static async getPendingGiveaways (req, res) {
    try {
      const giveaways = await GiveawayRepository.getPendingGiveaways()

      const giveawaysWithPhotos = await GiveawayController.attachFirstPhotoToGiveaways(giveaways)

      return response(res, true, StatusCodes.OK, giveawaysWithPhotos)
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

      if (existingGiveaway.Estado_ID === GIVEAWAY_STATES.CONCLUIDO || new Date(existingGiveaway.DataFim) < new Date()) {
        throw new HttpException('Já não pode alterar este sorteio', StatusCodes.BAD_REQUEST)
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

      if (data.thumbnails) {
        await ItemController.replaceItemPhotos(updatedData.itemId, data.thumbnails)
      }

      return response(res, true, StatusCodes.OK, 'Giveaway atualizado com sucesso.')
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao atualizar o giveaway.')
    }
  }

  static async getUserGiveaways (req, res) {
    const userId = req.user.Utilizador_ID

    try {
      const giveaways = await GiveawayRepository.getUserGiveaways(userId)

      const giveawaysWithPhotos = await GiveawayController.attachFirstPhotoToGiveaways(giveaways)

      return response(res, true, StatusCodes.OK, giveawaysWithPhotos)
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

      const stateId = await StateRepository.getStateById(status)

      if (!stateId) {
        throw new HttpException('Estado inválido.', StatusCodes.BAD_REQUEST)
      }

      await GiveawayRepository.updateGiveawayStatus(id, stateId)

      return response(res, true, StatusCodes.OK, 'Estado do sorteio atualizado.')
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao atualizar o estado do sorteio.')
    }
  }

  static async getNonCompletedGiveawaysByUser (req, res) {
    const userId = req.user.Utilizador_ID

    try {
      const uncompletedGiveaways = await GiveawayRepository.getNonCompletedGiveawaysByUser(userId)

      const giveawaysWithPhotos = await GiveawayController.attachFirstPhotoToGiveaways(uncompletedGiveaways)

      return response(res, true, StatusCodes.OK, giveawaysWithPhotos)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar os sorteios não completos.')
    }
  }

  static async getCompletedGiveawaysByUser (req, res) {
    const userId = req.user.Utilizador_ID

    try {
      const completedGiveaways = await GiveawayRepository.getCompletedGiveawaysByUser(userId)

      const giveawaysWithPhotos = await GiveawayController.attachFirstPhotoToGiveaways(completedGiveaways)

      return response(res, true, StatusCodes.OK, giveawaysWithPhotos)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar os sorteios completos.')
    }
  }

  static async attachPhotosToGiveaway (giveaway) {
    const photos = await ItemRepository.getItemPhoto(giveaway.Artigo_ID)

    return {
      ...giveaway,
      photos
    }
  }

  static async attachFirstPhotoToGiveaways (giveaways) {
    const giveawaysWithPhotos = []

    for (const giveaway of giveaways) {
      const photos = await ItemRepository.getItemPhoto(giveaway.Artigo_ID)

      const firstPhoto = photos.length > 0 ? photos[0] : null

      giveawaysWithPhotos.push({
        ...giveaway,
        photos: firstPhoto
      })
    }

    return giveawaysWithPhotos
  }
}
export default GiveawayController
