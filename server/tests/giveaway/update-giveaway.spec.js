import { describe, it, expect, vi, beforeEach } from 'vitest'
import { StatusCodes } from 'http-status-codes'

import GiveawayController from '../../src/controllers/giveaway-controller.js'
import GiveawayRepository from '../../src/repositories/giveaway-repository.js'
import ItemController from '../../src/controllers/item-controller.js'
import response from '../../src/utils/response.js'
import { GIVEAWAY_STATES } from '../../src/constants/status-constants.js'

vi.mock('../../src/repositories/giveaway-repository.js', () => ({
  default: {
    getGiveawayById: vi.fn(),
    updateGiveaway: vi.fn(),
    updateGiveawayStatus: vi.fn()
  }
}))

vi.mock('../../src/controllers/item-controller.js', () => ({
  default: {
    updateItemPhoto: vi.fn()
  }
}))

vi.mock('../../src/utils/response.js', () => ({
  default: vi.fn()
}))

describe('Operações de atualizar em sorteios', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Teste para updateGiveaway
  it('atualiza o sorteio com sucesso', async () => {
    const req = {
      params: { id: 1 },
      body: {
        description: 'Descrição atualizada'
        // os outros campos ficam em branco
      }
    }

    const res = {}

    const giveaway = {
      Titulo: 'Título antigo',
      Descricao: 'Desc',
      Artigo_ID: 99,
      NomeCategoria: 'Eletrónicos',
      Condicao: 'Quase Novo',
      DataInicio: new Date().toISOString(),
      DataFim: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // daqui a 7 dias
    }

    GiveawayRepository.getGiveawayById.mockResolvedValue(giveaway)
    GiveawayRepository.updateGiveaway.mockResolvedValue()

    await GiveawayController.updateGiveaway(req, res)

    expect(response).toHaveBeenCalledWith(res, true, StatusCodes.OK, 'Giveaway atualizado com sucesso.')
  })

  it('deve lançar erro se o sorteio não for encontrado', async () => {
    const req = { params: { id: 99 } }
    const res = {}

    GiveawayRepository.getGiveawayById.mockResolvedValue(null)

    await GiveawayController.updateGiveaway(req, res)

    expect(response).toHaveBeenCalledWith(res, false, StatusCodes.NOT_FOUND, 'Giveaway não encontrado.')
  })

  it('deve lançar erro se o sorteio já estiver concluído', async () => {
    const req = { params: { id: 1 }, body: { title: 'Updated Title' } }
    const res = {}
    const giveaway = { id: 1, Estado_ID: GIVEAWAY_STATES.CONCLUIDO, ArtigoArtigo_ID: 123 }

    GiveawayRepository.getGiveawayById.mockResolvedValue(giveaway)

    await GiveawayController.updateGiveaway(req, res)

    expect(response).toHaveBeenCalledWith(res, false, StatusCodes.BAD_REQUEST, 'Já não pode alterar este sorteio')
  })

  // Teste para updateGiveawayStatus
  it('deve atualizar o estado do sorteio com sucesso', async () => {
    const req = { params: { id: 1 }, body: { status: 'Disponível' } }
    const res = {}
    const giveaway = { id: 1, Estado: 'Em análise' }

    GiveawayRepository.getGiveawayById.mockResolvedValue(giveaway)

    GiveawayRepository.updateGiveawayStatus.mockResolvedValue(true)

    await GiveawayController.updateGiveawayStatus(req, res)

    expect(GiveawayRepository.updateGiveawayStatus).toHaveBeenCalledWith(1, 3)

    expect(response).toHaveBeenCalledWith(res, true, StatusCodes.OK, 'Estado do sorteio atualizado.')
  })

  it('deve lançar erro se o estado for inválido', async () => {
    const req = { params: { id: 1 }, body: { status: 999 } }
    const res = {}
    const giveaway = { id: 1 }

    GiveawayRepository.getGiveawayById.mockResolvedValue(giveaway)

    await GiveawayController.updateGiveawayStatus(req, res)

    expect(response).toHaveBeenCalledWith(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao atualizar o estado do sorteio.')
  })

  // Teste para updateGiveawayImage
  it('deve atualizar a imagem do sorteio com sucesso', async () => {
    const req = { params: { id: 1 }, body: { index: 0, thumbnail: 'new-thumbnail-url' } }
    const res = {}
    const giveaway = { id: 1, Artigo_ID: 123 }

    GiveawayRepository.getGiveawayById.mockResolvedValue(giveaway)
    ItemController.updateItemPhoto.mockResolvedValue(true)

    await GiveawayController.updateGiveawayImage(req, res)

    expect(ItemController.updateItemPhoto).toHaveBeenCalledWith({ itemId: 123, index: 0, thumbnail: 'new-thumbnail-url' })
    expect(response).toHaveBeenCalledWith(res, true, StatusCodes.OK, 'Imagem de sorteio atualizado com sucesso.')
  })

  it('deve lançar erro se o sorteio não for encontrado ao atualizar imagem', async () => {
    const req = { params: { id: 99 }, body: { index: 0, thumbnail: 'new-thumbnail-url' } }
    const res = {}

    GiveawayRepository.getGiveawayById.mockResolvedValue(null)

    await GiveawayController.updateGiveawayImage(req, res)

    expect(response).toHaveBeenCalledWith(res, false, StatusCodes.NOT_FOUND, 'Sorteio não encontrado.')
  })
})
