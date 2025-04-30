import { describe, it, expect, vi, beforeEach } from 'vitest'
import WinnerGiveawayController from '../../src/controllers/winner-giveaway-controller.js'
import GiveawayRepository from '../../src/repositories/giveaway-repository.js'
import WinnerGiveawayRepository from '../../src/repositories/winner-giveaway-repository.js'

vi.mock('../../src/repositories/giveaway-repository.js')
vi.mock('../../src/repositories/winner-giveaway-repository.js')

function criarMockReqRes (params = {}, body = {}, user = {}) {
  const req = { params, body, user }
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis()
  }
  return { req, res }
}

describe('Review do vencedor de sorteio', () => {
  beforeEach(() => vi.clearAllMocks())

  it('deve criar review com sucesso se for o vencedor', async () => {
    GiveawayRepository.getGiveawayById.mockResolvedValue({ Sorteio_ID: 1 })

    WinnerGiveawayRepository.getWinnerGiveawayById.mockResolvedValue({ InscricaoSorteioUtilizadorUtilizador_ID: 123, Nota: 0 })

    WinnerGiveawayRepository.updateGiveawayReview.mockResolvedValue()

    const { req, res } = criarMockReqRes({ id: 1 }, { review: 4 }, { Utilizador_ID: 123 })

    await WinnerGiveawayController.createReviewWinnerGiveaway(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Review do sorteio efetuada com sucesso.' })
  })

  it('deve falhar se utilizador não for o vencedor', async () => {
    GiveawayRepository.getGiveawayById.mockResolvedValue({})
    WinnerGiveawayRepository.getWinnerGiveawayById.mockResolvedValue({ InscricaoSorteioUtilizadorUtilizador_ID: 999, Nota: 0 })

    const { req, res } = criarMockReqRes({ id: 1 }, { review: 5 }, { Utilizador_ID: 123 })

    await WinnerGiveawayController.createReviewWinnerGiveaway(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Não pode fazer a review deste sorteio. Não ganhou o sorteio.' })
  })
})
