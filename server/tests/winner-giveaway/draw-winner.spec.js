import { describe, it, expect, vi, beforeEach } from 'vitest'
import WinnerGiveawayController from '../../src/controllers/winner-giveaway-controller.js'
import GiveawayRepository from '../../src/repositories/giveaway-repository.js'
import EntryGiveawayRepository from '../../src/repositories/entry-giveaway-repository.js'
import { HttpException } from '../../src/utils/error-handler.js'

vi.mock('../../src/repositories/giveaway-repository.js')
vi.mock('../../src/repositories/entry-giveaway-repository.js')

function criarMockReqRes (params = {}) {
  const req = { params, user: { Utilizador_ID: '10' }, body: { review: 5 } }
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn()
  }
  return { req, res }
}

describe('Testar a função drawWinnerGiveaway', () => {
  beforeEach(() => vi.clearAllMocks())

  it('deve retornar um vencedor aleatório quando o sorteio estiver encerrado', async () => {
    const giveawayId = '1'
    const giveaway = { id: giveawayId, DataFim: new Date() }
    const entries = [{ UtilizadorUtilizador_ID: '10' }, { UtilizadorUtilizador_ID: '20' }]

    GiveawayRepository.getGiveawayById.mockResolvedValue(giveaway)
    EntryGiveawayRepository.getAllEntriesGiveaway.mockResolvedValue(entries)

    // Mockar Math.random para sempre retornar 0.0 (o que escolherá o primeiro elemento)
    vi.spyOn(Math, 'random').mockReturnValue(0)

    const winnerId = await WinnerGiveawayController.drawWinnerGiveaway(giveawayId)

    expect(winnerId).toBe('10')
  })

  it('deve lançar erro se o sorteio ainda não tiver terminado', async () => {
    const giveawayId = 1
    const giveaway = { id: giveawayId, DataFim: new Date(Date.now() + 7200000) }

    GiveawayRepository.getGiveawayById.mockResolvedValue(giveaway)

    await expect(WinnerGiveawayController.drawWinnerGiveaway(giveawayId)).rejects.toBeInstanceOf(HttpException)
  })

  it('deve lançar erro se não houver inscrições para o sorteio', async () => {
    const giveawayId = 1
    const giveaway = { id: giveawayId, DataFim: new Date() }
    GiveawayRepository.getGiveawayById.mockResolvedValue(giveaway)
    EntryGiveawayRepository.getAllEntriesGiveaway.mockResolvedValue([])

    const { req, res } = criarMockReqRes({ id: giveawayId })

    await expect(WinnerGiveawayController.drawWinnerGiveaway(req, res)).rejects.toThrow(HttpException)
  })

  it('deve lançar erro se o sorteio não for encontrado', async () => {
    const giveawayId = '1'
    GiveawayRepository.getGiveawayById.mockResolvedValue(null)

    const { req, res } = criarMockReqRes({ id: giveawayId })

    await expect(WinnerGiveawayController.drawWinnerGiveaway(req, res)).rejects.toThrow(HttpException)
  })
})
