import { describe, it, expect, vi, beforeEach } from 'vitest'
import EntryGiveawayController from '../../src/controllers/entry-giveaway-controller.js'
import EntryGiveawayRepository from '../../src/repositories/entry-giveaway-repository.js'
import { StatusCodes } from 'http-status-codes'

vi.mock('../../src/repositories/entry-giveaway-repository.js')

function criarMockReqRes (params = {}) {
  const req = {
    params: { giveawayId: '1', ...params },
    user: { Utilizador_ID: '10' }
  }
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn()
  }
  return { req, res }
}

describe('Testando o método getEntryGiveawayById', () => {
  beforeEach(() => vi.clearAllMocks())

  it('deve retornar a inscrição com sucesso', async () => {
    const entry = { giveawayId: '1', userId: '10', entryDate: new Date().toISOString() }
    EntryGiveawayRepository.getEntryGiveawayById.mockResolvedValue(entry)

    const { req, res } = criarMockReqRes()

    await EntryGiveawayController.getEntryGiveawayById(req, res)

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: entry
    })
  })

  it('deve retornar 404 se inscrição não for encontrada', async () => {
    EntryGiveawayRepository.getEntryGiveawayById.mockResolvedValue(null)

    const { req, res } = criarMockReqRes({ giveawayId: '1' })
    await EntryGiveawayController.getEntryGiveawayById(req, res)

    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND)

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Inscrição não encontrada.'
    })
  })

  it('deve retornar erro se ocorrer um erro interno', async () => {
    EntryGiveawayRepository.getEntryGiveawayById.mockRejectedValue(new Error('Erro interno'))

    const { req, res } = criarMockReqRes()

    await EntryGiveawayController.getEntryGiveawayById(req, res)

    expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Erro ao obter a inscrição no sorteio. Tente novamente mais tarde.'
    })
  })
})
