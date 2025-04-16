import { describe, it, expect, vi, beforeEach } from 'vitest'
import SaleController from '../../src/controllers/sale-controller.js'
import SaleRepository from '../../src/repositories/sale-repository.js'
import response from '../../src/utils/response.js'
import { StatusCodes } from 'http-status-codes'

// Mock para o repositório de vendas
vi.mock('../../src/repositories/sale-repository.js', () => ({
  default: {
    getSaleById: vi.fn(),
    getAllSales: vi.fn(),
    getAvailableSales: vi.fn(),
    getPendingSales: vi.fn(),
    getUserSales: vi.fn(),
    getNonCompletedSalesByUser: vi.fn(),
    getCompletedSalesByUser: vi.fn()
  }
}))

// Mock para o módulo de resposta
vi.mock('../../src/utils/response.js', () => ({
  default: vi.fn()
}))

// Mock para o repositório de fotos dos itens
vi.mock('../../src/repositories/item-repository.js', () => ({
  default: {
    getItemPhoto: vi.fn().mockResolvedValue([
      { public_id: 'public_id_1', url: 'http://example.com/photo1.jpg' },
      { public_id: 'public_id_2', url: 'http://example.com/photo2.jpg' }
    ])
  }
}))

describe('SaleController', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Mock para a função `attachPhotosToSale`, que adiciona as fotos à venda
  it('getSaleById - deve retornar a venda com fotos', async () => {
    const req = { params: { id: 1 } }
    const res = {}

    const sale = { id: 1 }

    SaleRepository.getSaleById.mockResolvedValue(sale)

    vi.spyOn(SaleController, 'attachPhotosToSale').mockImplementation(sale => ({
      ...sale,
      photos: [
        { public_id: 'public_id_1', url: 'http://example.com/photo1.jpg' },
        { public_id: 'public_id_2', url: 'http://example.com/photo2.jpg' }
      ]
    }))

    await SaleController.getSaleById(req, res)

    const saleWithPhotos = {
      ...sale,
      photos: [
        { public_id: 'public_id_1', url: 'http://example.com/photo1.jpg' },
        { public_id: 'public_id_2', url: 'http://example.com/photo2.jpg' }
      ]
    }

    expect(response).toHaveBeenCalledWith(res, true, StatusCodes.OK, saleWithPhotos)
    expect(SaleController.attachPhotosToSale).toHaveBeenCalledWith(sale)
  })

  it('getAllSales - deve retornar todas as vendas com fotos', async () => {
    const req = {}
    const res = {}

    const sales = [
      { id: 1, Artigo_ID: 101 },
      { id: 2, Artigo_ID: 102 }
    ]

    SaleRepository.getAllSales.mockResolvedValue(sales)

    const attachPhotosToSaleMock = vi.fn().mockImplementation(sale => ({
      ...sale,
      photos: [
        { public_id: 'public_id_1', url: 'http://example.com/photo1.jpg' },
        { public_id: 'public_id_2', url: 'http://example.com/photo2.jpg' }
      ]
    }))

    SaleController.attachPhotosToSale = attachPhotosToSaleMock

    await SaleController.getAllSales(req, res)

    const salesWithPhotos = sales.map(sale => ({
      ...sale,
      photos: [
        { public_id: 'public_id_1', url: 'http://example.com/photo1.jpg' },
        { public_id: 'public_id_2', url: 'http://example.com/photo2.jpg' }
      ]
    }))

    expect(response).toHaveBeenCalledWith(res, true, StatusCodes.OK, salesWithPhotos)

    sales.forEach(sale => {
      expect(attachPhotosToSaleMock).toHaveBeenCalledWith(sale)
    })
  })

  it('getAvailableSales - deve retornar vendas disponíveis com fotos', async () => {
    const req = {}
    const res = {}

    const sales = [{ id: 1 }]

    SaleRepository.getAvailableSales.mockResolvedValue(sales)

    vi.spyOn(SaleController, 'attachPhotosToSale').mockImplementation(sale => ({
      ...sale,
      photos: [
        { public_id: 'public_id_1', url: 'http://example.com/photo1.jpg' },
        { public_id: 'public_id_2', url: 'http://example.com/photo2.jpg' }
      ]
    }))

    await SaleController.getAvailableSales(req, res)

    const salesWithPhotos = sales.map(sale => ({
      ...sale,
      photos: [
        { public_id: 'public_id_1', url: 'http://example.com/photo1.jpg' },
        { public_id: 'public_id_2', url: 'http://example.com/photo2.jpg' }
      ]
    }))

    expect(response).toHaveBeenCalledWith(res, true, StatusCodes.OK, salesWithPhotos)
  })

  it('getPendingSales - deve retornar vendas pendentes com fotos', async () => {
    const req = {}
    const res = {}

    const sales = [{ id: 1 }]

    SaleRepository.getPendingSales.mockResolvedValue(sales)

    vi.spyOn(SaleController, 'attachPhotosToSale').mockImplementation(sale => ({
      ...sale,
      photos: [
        { public_id: 'public_id_1', url: 'http://example.com/photo1.jpg' },
        { public_id: 'public_id_2', url: 'http://example.com/photo2.jpg' }
      ]
    }))

    await SaleController.getPendingSales(req, res)

    const salesWithPhotos = sales.map(sale => ({
      ...sale,
      photos: [
        { public_id: 'public_id_1', url: 'http://example.com/photo1.jpg' },
        { public_id: 'public_id_2', url: 'http://example.com/photo2.jpg' }
      ]
    }))

    expect(response).toHaveBeenCalledWith(res, true, StatusCodes.OK, salesWithPhotos)
  })

  it('getUserSales - deve retornar vendas do utilizador com fotos', async () => {
    const req = { user: { Utilizador_ID: 1 } }
    const res = {}

    const sales = [{ id: 1 }]

    SaleRepository.getUserSales.mockResolvedValue(sales)

    vi.spyOn(SaleController, 'attachPhotosToSale').mockImplementation(sale => ({
      ...sale,
      photos: [
        { public_id: 'public_id_1', url: 'http://example.com/photo1.jpg' },
        { public_id: 'public_id_2', url: 'http://example.com/photo2.jpg' }
      ]
    }))

    await SaleController.getUserSales(req, res)

    const salesWithPhotos = sales.map(sale => ({
      ...sale,
      photos: [
        { public_id: 'public_id_1', url: 'http://example.com/photo1.jpg' },
        { public_id: 'public_id_2', url: 'http://example.com/photo2.jpg' }
      ]
    }))

    expect(response).toHaveBeenCalledWith(res, true, StatusCodes.OK, salesWithPhotos)
  })

  it('getNonCompletedSalesByUser - deve retornar vendas não completas com fotos', async () => {
    const req = { user: { Utilizador_ID: 1 } }
    const res = {}

    const sales = [{ id: 1 }]

    SaleRepository.getNonCompletedSalesByUser.mockResolvedValue(sales)

    vi.spyOn(SaleController, 'attachPhotosToSale').mockImplementation(sale => ({
      ...sale,
      photos: [
        { public_id: 'public_id_1', url: 'http://example.com/photo1.jpg' },
        { public_id: 'public_id_2', url: 'http://example.com/photo2.jpg' }
      ]
    }))

    await SaleController.getNonCompletedSalesByUser(req, res)

    const salesWithPhotos = sales.map(sale => ({
      ...sale,
      photos: [
        { public_id: 'public_id_1', url: 'http://example.com/photo1.jpg' },
        { public_id: 'public_id_2', url: 'http://example.com/photo2.jpg' }
      ]
    }))

    expect(response).toHaveBeenCalledWith(res, true, StatusCodes.OK, salesWithPhotos)
  })

  it('getCompletedSalesByUser - deve retornar vendas completas com fotos', async () => {
    const req = { user: { Utilizador_ID: 1 } }
    const res = {}

    const sales = [{ id: 1 }]

    SaleRepository.getCompletedSalesByUser.mockResolvedValue(sales)

    vi.spyOn(SaleController, 'attachPhotosToSale').mockImplementation(sale => ({
      ...sale,
      photos: [
        { public_id: 'public_id_1', url: 'http://example.com/photo1.jpg' },
        { public_id: 'public_id_2', url: 'http://example.com/photo2.jpg' }
      ]
    }))

    await SaleController.getCompletedSalesByUser(req, res)

    const salesWithPhotos = sales.map(sale => ({
      ...sale,
      photos: [
        { public_id: 'public_id_1', url: 'http://example.com/photo1.jpg' },
        { public_id: 'public_id_2', url: 'http://example.com/photo2.jpg' }
      ]
    }))

    expect(response).toHaveBeenCalledWith(res, true, StatusCodes.OK, salesWithPhotos)
  })

  it('getSaleById - deve lançar erro se venda não existir', async () => {
    const req = { params: { id: 99 } }
    const res = {}

    SaleRepository.getSaleById.mockResolvedValue(null)

    await SaleController.getSaleById(req, res)

    expect(SaleRepository.getSaleById).toHaveBeenCalledWith(99)

    expect(response).toHaveBeenCalledWith(res, false, 404, 'Venda não encontrada.')
  })
})
