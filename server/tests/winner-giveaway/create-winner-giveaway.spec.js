import { describe, it, vi, expect, beforeEach } from 'vitest'
import WinnerGiveawayController from '../../src/controllers/winner-giveaway-controller.js'
import GiveawayRepository from '../../src/repositories/giveaway-repository.js'
import WinnerGiveawayRepository from '../../src/repositories/winner-giveaway-repository.js'

vi.mock('../../src/repositories/giveaway-repository.js')
vi.mock('../../src/repositories/winner-giveaway-repository.js')
vi.mock('../../src/controllers/notification-controller.js')

function criarMockReqRes (params = {}, body = {}, user = {}) {
  const req = { params, body, user }
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis()
  }
  return { req, res }
}

describe('Criar vencedor de sorteio', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve criar o vencedor se tudo estiver correto', async () => {
    const giveaway = { Sorteio_ID: 1, Titulo: 'Sorteio Top', DataFim: new Date(Date.now() - 1000) }

    WinnerGiveawayRepository.getWinnerGiveawayById.mockResolvedValue(null)

    GiveawayRepository.getGiveawayById.mockResolvedValue(giveaway)

    WinnerGiveawayController.drawWinnerGiveaway = vi.fn().mockResolvedValue(10)

    WinnerGiveawayRepository.createWinnerGiveaway.mockResolvedValue()

    GiveawayRepository.updateGiveawayStatus.mockResolvedValue()

    const { req, res } = criarMockReqRes({ id: 1 })

    await WinnerGiveawayController.createWinnerGiveaway(req, res)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Vencedor do sorteio criado com sucesso.' })
  })

  it('não deve criar se já existir vencedor', async () => {
    WinnerGiveawayRepository.getWinnerGiveawayById.mockResolvedValue({})
    const { req, res } = criarMockReqRes({ id: 1 })

    await WinnerGiveawayController.createWinnerGiveaway(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Vencedor do sorteio já existe.' })
  })
})
