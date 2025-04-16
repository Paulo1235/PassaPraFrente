import { describe, it, expect, vi, beforeEach } from 'vitest'
import ItemController from '../../src/controllers/item-controller.js'
import SaleRepository from '../../src/repositories/sale-repository.js'
import response from '../../src/utils/response.js'
import { StatusCodes } from 'http-status-codes'
import SaleController from '../../src/controllers/sale-controller.js'

vi.mock('../../src/controllers/item-controller.js', () => ({
  default: {
    createItem: vi.fn()
  }
}))

vi.mock('../../src/repositories/sale-repository.js', () => ({
  default: {
    createSale: vi.fn()
  }
}))

vi.mock('../../src/utils/response.js', () => ({
  default: vi.fn()
}))

describe('SaleController.createSale', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve criar uma venda com sucesso', async () => {
    const req = {
      user: { Utilizador_ID: 1 },
      body: { title: 'Produto', preco: 100 }
    }
    const res = {}

    const fakeItem = { Artigo_ID: 99 }

    ItemController.createItem.mockResolvedValue(fakeItem)
    SaleRepository.createSale.mockResolvedValue(true)

    await SaleController.createSale(req, res)

    expect(ItemController.createItem).toHaveBeenCalledWith(req.body)
    expect(SaleRepository.createSale).toHaveBeenCalledWith(fakeItem, req.body, 1)

    expect(response).toHaveBeenCalledWith(res, true, StatusCodes.CREATED, 'Venda criada com sucesso')
  })
})
