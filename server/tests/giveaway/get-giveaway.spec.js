import { describe, it, expect, vi, beforeEach } from 'vitest'
import GiveawayController from '../../src/controllers/giveaway-controller.js'
import GiveawayRepository from '../../src/repositories/giveaway-repository.js'
import ItemRepository from '../../src/repositories/item-repository.js'
import { StatusCodes } from 'http-status-codes'
import response from '../../src/utils/response.js'
import { handleError } from '../../src/utils/error-handler.js'

vi.mock('../../src/repositories/giveaway-repository.js', () => ({
  default: {
    getNonCompletedGiveawaysByUser: vi.fn(),
    getPendingGiveaways: vi.fn(),
    getAvailableGiveaways: vi.fn()
  }
}))

vi.mock('../../src/repositories/item-repository.js', () => ({
  default: {
    getItemPhoto: vi.fn()
  }
}))

vi.mock('../../src/utils/response.js', () => ({
  default: vi.fn()
}))

vi.mock('../../src/utils/error-handler.js', () => ({
  handleError: vi.fn()
}))

describe('Operações GET em sorteios', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Obter sorteios disponíveis', () => {
    it('deve devolver os sorteios disponíveis', async () => {
      const req = { user: { Utilizador_ID: 456 } }
      const res = {}
      const uncompletedGiveawaysMock = [{ Artigo_ID: 3, Titulo: 'Sorteio Concluída' }]
      const photoMock = [{ url: 'fotoConcluida.jpg' }]

      GiveawayRepository.getNonCompletedGiveawaysByUser.mockResolvedValue(uncompletedGiveawaysMock)

      ItemRepository.getItemPhoto.mockResolvedValueOnce(photoMock)

      await GiveawayController.getNonCompletedGiveawaysByUser(req, res)

      expect(GiveawayRepository.getNonCompletedGiveawaysByUser).toHaveBeenCalledWith(456)

      expect(ItemRepository.getItemPhoto).toHaveBeenCalledWith(3)

      expect(response).toHaveBeenCalledWith(res, true, StatusCodes.OK, [
        { ...uncompletedGiveawaysMock[0], photos: photoMock[0] }
      ])
    })
    it('deve devolver erro se falhar a buscar sorteios do utilizador', async () => {
      const req = { user: { Utilizador_ID: '123' } }
      const res = {}

      GiveawayRepository.getAvailableGiveaways.mockRejectedValue(new Error('Erro ao buscar vendas'))

      await GiveawayController.getAvailableGiveaways(req, res)

      expect(handleError).toHaveBeenCalled()
    })
  })

  describe('Obter sorteios do utilizador ainda não completos', () => {
    it('deve devolver os sorteios não completos do utilizador', async () => {
      const req = { user: { Utilizador_ID: 456 } }
      const res = {}
      const uncompletedGiveawaysMock = [{ Artigo_ID: 3, Titulo: 'Sorteio Concluída' }]
      const photoMock = [{ url: 'fotoConcluida.jpg' }]

      GiveawayRepository.getNonCompletedGiveawaysByUser.mockResolvedValue(uncompletedGiveawaysMock)

      ItemRepository.getItemPhoto.mockResolvedValueOnce(photoMock)

      await GiveawayController.getNonCompletedGiveawaysByUser(req, res)

      expect(GiveawayRepository.getNonCompletedGiveawaysByUser).toHaveBeenCalledWith(456)

      expect(ItemRepository.getItemPhoto).toHaveBeenCalledWith(3)

      expect(response).toHaveBeenCalledWith(res, true, StatusCodes.OK, [
        { ...uncompletedGiveawaysMock[0], photos: photoMock[0] }
      ])
    })

    it('deve devolver erro se falhar a buscar sorteios não concluídos', async () => {
      const req = { user: { Utilizador_ID: 456 } }
      const res = {}

      GiveawayRepository.getNonCompletedGiveawaysByUser.mockRejectedValue(new Error('Erro'))

      await GiveawayController.getNonCompletedGiveawaysByUser(req, res)

      expect(handleError).toHaveBeenCalled()
    })
  })
})
