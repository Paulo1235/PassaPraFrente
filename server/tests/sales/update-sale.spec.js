import { describe, it, expect, vi, beforeEach } from 'vitest'
import { StatusCodes } from 'http-status-codes'

import SaleController from '../../src/controllers/sale-controller.js'
import SaleRepository from '../../src/repositories/sale-repository.js'
import ItemController from '../../src/controllers/item-controller.js'
import response from '../../src/utils/response.js'
import { SALE_STATES } from '../../src/constants/status-constants.js'

vi.mock('../../src/repositories/sale-repository.js', () => ({
  default: {
    getSaleById: vi.fn(),
    updateSale: vi.fn(),
    updateSaleStatus: vi.fn()
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

describe('Operações de atualizar em vendas', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Teste para updateSale
  it('atualiza a venda com sucesso', async () => {
    const req = {
      params: { id: 1 },
      body: {
        title: 'Título atualizado'
        // os outros campos ficam em branco
      }
    }

    const res = {}

    const sale = {
      Estado_ID: SALE_STATES.EM_ANALISE,
      Titulo: 'Título antigo',
      Descricao: 'Desc',
      Valor: 10,
      Artigo_ID: 99,
      Utilizador_ID: 5
    }

    SaleRepository.getSaleById.mockResolvedValue(sale)
    SaleRepository.updateSale.mockResolvedValue()

    await SaleController.updateSale(req, res)

    expect(SaleRepository.updateSale).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Título atualizado' }),
      1
    )
    expect(response).toHaveBeenCalledWith(res, true, StatusCodes.OK, 'Venda atualizada com sucesso.')
  })

  it('deve lançar erro se a venda não for encontrada', async () => {
    const req = { params: { id: 99 } }
    const res = {}

    SaleRepository.getSaleById.mockResolvedValue(null)

    await SaleController.updateSale(req, res)

    expect(response).toHaveBeenCalledWith(res, false, StatusCodes.NOT_FOUND, 'Venda não encontrada.')
  })

  it('deve lançar erro se a venda já estiver concluída', async () => {
    const req = { params: { id: 1 }, body: { title: 'Updated Title' } }
    const res = {}
    const sale = { id: 1, Estado_ID: 4, Artigo_ID: 123 }

    SaleRepository.getSaleById.mockResolvedValue(sale)

    await SaleController.updateSale(req, res)

    expect(response).toHaveBeenCalledWith(res, false, StatusCodes.BAD_REQUEST, 'Já não é possível alterar esta venda.')
  })

  // Teste para updateSaleStatus
  it('deve atualizar o estado da venda com sucesso', async () => {
    const req = { params: { id: 1 }, body: { status: 'Disponível' } }
    const res = {}
    const sale = { id: 1, Estado_ID: 'Em análise' }

    SaleRepository.getSaleById.mockResolvedValue(sale)

    SaleRepository.updateSaleStatus.mockResolvedValue(true)

    await SaleController.updateSaleStatus(req, res)

    expect(SaleRepository.updateSaleStatus).toHaveBeenCalledWith(1, 3)

    expect(response).toHaveBeenCalledWith(res, true, StatusCodes.OK, 'Estado da venda atualizado.')
  })

  it('deve lançar erro se o estado for inválido', async () => {
    const req = { params: { id: 1 }, body: { status: 999 } }
    const res = {}
    const sale = { id: 1 }

    SaleRepository.getSaleById.mockResolvedValue(sale)

    await SaleController.updateSaleStatus(req, res)

    expect(response).toHaveBeenCalledWith(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao atualizar o estado da venda.')
  })

  // Teste para updateSaleImage
  it('deve atualizar a imagem da venda com sucesso', async () => {
    const req = { params: { id: 1 }, body: { index: 0, thumbnail: 'new-thumbnail-url' } }
    const res = {}
    const sale = { id: 1, Artigo_ID: 123 }

    SaleRepository.getSaleById.mockResolvedValue(sale)
    ItemController.updateItemPhoto.mockResolvedValue(true)

    await SaleController.updateSaleImage(req, res)

    expect(ItemController.updateItemPhoto).toHaveBeenCalledWith({ itemId: 123, index: 0, thumbnail: 'new-thumbnail-url' })
    expect(response).toHaveBeenCalledWith(res, true, StatusCodes.OK, 'Imagem de venda atualizada com sucesso.')
  })

  it('deve lançar erro se a venda não for encontrada ao atualizar imagem', async () => {
    const req = { params: { id: 99 }, body: { index: 0, thumbnail: 'new-thumbnail-url' } }
    const res = {}

    SaleRepository.getSaleById.mockResolvedValue(null)

    await SaleController.updateSaleImage(req, res)

    expect(response).toHaveBeenCalledWith(res, false, StatusCodes.NOT_FOUND, 'Venda não encontrada')
  })
})
