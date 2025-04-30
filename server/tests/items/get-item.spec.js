import { describe, it, expect, vi, beforeEach } from 'vitest'
import ItemController from '../../src/controllers/item-controller.js'
import ItemRepository from '../../src/repositories/item-repository.js'
import { StatusCodes } from 'http-status-codes'

vi.mock('../../src/repositories/item-repository.js')

function criarMockReqRes (params = {}) {
  return {
    req: { params },
    res: {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis()
    }
  }
}

describe('Obter Items', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve retornar todos os itens', async () => {
    const items = [{ Artigo_ID: 1, Nome: 'Item 1' }]
    ItemRepository.getAllItems.mockResolvedValue(items)

    const { req, res } = criarMockReqRes()
    await ItemController.getAllItems(req, res)

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
    expect(res.json).toHaveBeenCalledWith({ success: true, message: items })
  })

  it('deve retornar item por ID com sucesso', async () => {
    const item = { Artigo_ID: 1, Nome: 'Item 1' }
    ItemRepository.getItemById.mockResolvedValue(item)

    const { req, res } = criarMockReqRes({ id: 1 })
    await ItemController.getItemById(req, res)

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
    expect(res.json).toHaveBeenCalledWith({ success: true, message: item })
  })

  it('deve retornar 404 se item não for encontrado', async () => {
    ItemRepository.getItemById.mockResolvedValue(null)

    const { req, res } = criarMockReqRes({ id: 1 })
    await ItemController.getItemById(req, res)

    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND)
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Artigo não encontrado.' })
  })
})
