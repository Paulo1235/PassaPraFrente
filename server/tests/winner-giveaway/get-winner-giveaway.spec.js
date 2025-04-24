import { describe, it, expect, vi, beforeEach } from 'vitest'
import WinnerGiveawayController from '../../src/controllers/winner-giveaway-controller.js'
import WinnerGiveawayRepository from '../../src/repositories/winner-giveaway-repository.js'
import GiveawayRepository from '../../src/repositories/giveaway-repository.js'

vi.mock('../../src/repositories/winner-giveaway-repository.js')
vi.mock('../../src/repositories/giveaway-repository.js')

function criarMockReqRes (params = {}) {
  const req = { params, user: { Utilizador_ID: '10' }, body: { review: 5 } }
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn()
  }
  return { req, res }
}

describe('Operações GET relacionadas a vencedores de sorteios', () => {
  beforeEach(() => vi.clearAllMocks())

  it('deve retornar todos os vencedores', async () => {
    const mockProposals = [{ id: 1 }, { id: 2 }]
    WinnerGiveawayRepository.getAllWinnersGiveaways.mockResolvedValue(mockProposals)
    const { req, res } = criarMockReqRes()

    await WinnerGiveawayController.getAllWinnersGiveaways(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ success: true, message: mockProposals })
  })

  it('deve retornar erro se giveaway não for encontrado', async () => {
    GiveawayRepository.getGiveawayById.mockResolvedValue(null)

    const { req, res } = criarMockReqRes({ id: '1' })
    await WinnerGiveawayController.getWinnerGiveawayById(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Giveaway não encontrado.' })
  })

  it('deve lidar com erro ao listar todos os vencedores', async () => {
    const { res } = criarMockReqRes()
    WinnerGiveawayRepository.getAllWinnersGiveaways.mockRejectedValue(new Error('Erro'))

    await WinnerGiveawayController.getAllWinnersGiveaways({}, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalled()
  })
})
