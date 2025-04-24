import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SaleController } from '../../src/controllers/sale-controller.js'
import * as SaleRepository from '../../src/repositories/sale-repository.js'
import { StatusCodes } from 'http-status-codes'

// Mock apenas das dependências externas
vi.mock('../../src/repositories/sale-repository.js')
vi.mock('../../src/controllers/item-controller.js')
vi.mock('../../src/services/id-service.js')

vi.mock('../../src/constants/saleStates', () => ({
  SALE_STATES: {
    CONCLUIDO: 3
  }
}))

// Mock apenas dos métodos estáticos auxiliares do SaleController
vi.mock('../../src/controllers/sale-controller.js', async (importOriginal) => {
  const original = await importOriginal()
  return {
    ...original,
    attachPhotosToSale: vi.fn(),
    attachFirstPhotoToSales: vi.fn()
  }
})

describe('SaleController', () => {
  let mockReq, mockRes

  beforeEach(() => {
    vi.clearAllMocks()

    mockReq = {
      params: {},
      body: {},
      user: {}
    }

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    }
  })

  describe('getSaleById', () => {
    it('deve retornar uma venda com fotos quando encontrada', async () => {
      const mockSale = { id: 1, Titulo: 'Venda Teste' }
      const mockSaleWithPhotos = { ...mockSale, photos: ['photo1.jpg'] }

      SaleRepository.getSaleById.mockResolvedValue(mockSale.id)
      SaleController.attachPhotosToSale.mockResolvedValue(mockSaleWithPhotos)

      mockReq.params.id = '1'

      await SaleController.getSaleById(mockReq, mockRes)

      expect(SaleRepository.getSaleById).toHaveBeenCalledWith('1')
      expect(SaleController.attachPhotosToSale).toHaveBeenCalledWith(mockSale)
      expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockSaleWithPhotos
      })
    })

    it('deve retornar erro quando venda não existe', async () => {
      SaleRepository.getSaleById.mockResolvedValue(null)
      mockReq.params.id = '999'

      await SaleController.getSaleById(mockReq, mockRes)

      expect(SaleRepository.getSaleById).toHaveBeenCalledWith('999')
      expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Venda não encontrada.',
        error: expect.anything()
      })
    })
  })

  describe('getUserSales', () => {
    it('deve retornar vendas do utilizador com fotos', async () => {
      const userId = 5
      const mockSales = [
        { id: 1, Utilizador_ID: userId },
        { id: 2, Utilizador_ID: userId }
      ]
      const mockSalesWithPhotos = mockSales.map(sale => ({
        ...sale,
        firstPhoto: 'photo.jpg'
      }))

      mockReq.user.Utilizador_ID = userId
      SaleRepository.getUserSales.mockResolvedValue(mockSales)
      SaleController.attachFirstPhotoToSales.mockResolvedValue(mockSalesWithPhotos)

      await SaleController.getUserSales(mockReq, mockRes)

      expect(SaleRepository.getUserSales).toHaveBeenCalledWith(userId)
      expect(SaleController.attachFirstPhotoToSales).toHaveBeenCalledWith(mockSales)
      expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockSalesWithPhotos
      })
    })
  })

  describe('getCompletedSalesByUser', () => {
    it('deve retornar vendas completas do usuário', async () => {
      const userId = 5
      const mockSales = [{ id: 1 }, { id: 2 }]
      const mockSalesWithPhotos = mockSales.map(sale => ({
        ...sale,
        firstPhoto: 'photo.jpg'
      }))

      mockReq.user.Utilizador_ID = userId
      SaleRepository.getCompletedSalesByUser.mockResolvedValue(mockSales)
      SaleController.attachFirstPhotoToSales.mockResolvedValue(mockSalesWithPhotos)

      await SaleController.getCompletedSalesByUser(mockReq, mockRes)

      expect(SaleRepository.getCompletedSalesByUser).toHaveBeenCalledWith(userId)
      expect(SaleController.attachFirstPhotoToSales).toHaveBeenCalledWith(mockSales)
      expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockSalesWithPhotos
      })
    })
  })

  describe('getNonCompletedSalesByUser', () => {
    it('deve retornar vendas não completas do usuário', async () => {
      const userId = 5
      const mockSales = [{ id: 1 }, { id: 2 }]
      const mockSalesWithPhotos = mockSales.map(sale => ({
        ...sale,
        firstPhoto: 'photo.jpg'
      }))

      mockReq.user.Utilizador_ID = userId
      SaleRepository.getNonCompletedSalesByUser.mockResolvedValue(mockSales)
      SaleController.attachFirstPhotoToSales.mockResolvedValue(mockSalesWithPhotos)

      await SaleController.getNonCompletedSalesByUser(mockReq, mockRes)

      expect(SaleRepository.getNonCompletedSalesByUser).toHaveBeenCalledWith(userId)
      expect(SaleController.attachFirstPhotoToSales).toHaveBeenCalledWith(mockSales)
      expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.OK)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockSalesWithPhotos
      })
    })
  })
})
