import { describe, it, expect, vi, beforeEach } from 'vitest'
import { StatusCodes } from 'http-status-codes'
import EntryGiveawayController from '../../src/controllers/entry-giveaway-controller.js'
import GiveawayRepository from '../../src/repositories/giveaway-repository.js'
import EntryGiveawayRepository from '../../src/repositories/entry-giveaway-repository.js'
import { GIVEAWAY_STATES } from '../../src/constants/status-constants.js'

vi.mock('../../src/repositories/giveaway-repository.js', () => ({
  default: {
    getGiveawayById: vi.fn()
  }
}))

vi.mock('../../src/repositories/entry-giveaway-repository.js', () => ({
  default: {
    getEntryGiveawayById: vi.fn(),
    createEntryGiveaway: vi.fn()
  }
}))

describe('EntryGiveawayController - createEntryGiveaway', () => {
  const mockRes = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis()
  }

  const mockReq = {
    params: { giveawayId: '1' },
    user: { Utilizador_ID: 2 }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    GiveawayRepository.getGiveawayById.mockReset()
    EntryGiveawayRepository.getEntryGiveawayById.mockReset()
    EntryGiveawayRepository.createEntryGiveaway.mockReset()
  })

  it('retornar 404 se sorteio não existir', async () => {
    GiveawayRepository.getGiveawayById.mockResolvedValue(null)

    await EntryGiveawayController.createEntryGiveaway(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND)
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Sorteio não encontrado.'
    })
  })

  it('retornar 400 se sorteio já acabou', async () => {
    GiveawayRepository.getGiveawayById.mockResolvedValue({
      DataFim: new Date('2020-01-01'),
      Estado_ID: GIVEAWAY_STATES.CONCLUIDO
    })

    await EntryGiveawayController.createEntryGiveaway(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'O sorteio já terminou. Já não é possível inscrever-se.'
    })
  })

  it('deve retornar 400 se o utilizador já está inscrito no sorteio', async () => {
    GiveawayRepository.getGiveawayById.mockResolvedValue({
      DataFim: new Date('2026-01-01'),
      Estado_ID: GIVEAWAY_STATES.DISPONIVEL
    })
    EntryGiveawayRepository.getEntryGiveawayById.mockResolvedValue({ id: 1 })

    await EntryGiveawayController.createEntryGiveaway(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
  })

  it('deve criar inscrição com código 201', async () => {
    GiveawayRepository.getGiveawayById.mockResolvedValue({
      DataFim: new Date('2026-01-01'),
      Estado_ID: GIVEAWAY_STATES.DISPONIVEL
    })

    EntryGiveawayRepository.getEntryGiveawayById.mockResolvedValue(null)
    EntryGiveawayRepository.createEntryGiveaway.mockResolvedValue(true)

    await EntryGiveawayController.createEntryGiveaway(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.CREATED)
  })
})
