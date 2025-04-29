import { describe, it, expect, vi, beforeEach } from 'vitest'
import ItemController from '../../src/controllers/item-controller.js'
import GiveawayRepository from '../../src/repositories/giveaway-repository.js'
import response from '../../src/utils/response.js'
import { StatusCodes } from 'http-status-codes'
import GiveawayController from '../../src/controllers/giveaway-controller.js'

vi.mock('../../src/controllers/item-controller.js', () => ({
  default: {
    createItem: vi.fn()
  }
}))

vi.mock('../../src/repositories/giveaway-repository.js', () => ({
  default: {
    createGiveaway: vi.fn()
  }
}))

vi.mock('../../src/utils/response.js', () => ({
  default: vi.fn()
}))

describe('Criar um sorteio', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve criar um sorteio com sucesso', async () => {
    const req = {
      user: { Utilizador_ID: 1 },
      body: { title: 'Produto' }
    }
    const res = {}

    const fakeItem = { Artigo_ID: 99 }

    ItemController.createItem.mockResolvedValue(fakeItem)
    GiveawayRepository.createGiveaway.mockResolvedValue(true)

    await GiveawayController.createGiveaway(req, res)

    expect(ItemController.createItem).toHaveBeenCalledWith(req.body)
    expect(GiveawayRepository.createGiveaway).toHaveBeenCalledWith(fakeItem, req.body, 1)

    expect(response).toHaveBeenCalledWith(res, true, StatusCodes.CREATED, 'Giveaway criado com sucesso.')
  })
})
