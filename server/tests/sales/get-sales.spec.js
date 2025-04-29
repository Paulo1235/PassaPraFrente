import { describe, it, expect, vi, beforeEach } from 'vitest'
import SaleController from '../../src/controllers/sale-controller.js'
import SaleRepository from '../../src/repositories/sale-repository.js'
import ItemRepository from '../../src/repositories/item-repository.js'
import { StatusCodes } from 'http-status-codes'
import response from '../../src/utils/response.js'
import { handleError } from '../../src/utils/error-handler.js'

vi.mock('../../src/repositories/sale-repository.js', () => ({
  default: {
    getSaleById: vi.fn(),
    getCompletedSalesByUser: vi.fn(),
    getUserSales: vi.fn()
  }
}))

vi.mock('../../src/repositories/item-repository.js', () => ({
  default: {
    getItemPhoto: vi.fn()
  }
}))

vi.mock('../../src/utils/response.js', () => ({
  default: vi.fn()
}))

vi.mock('../../src/utils/error-handler.js', () => ({
  handleError: vi.fn()
}))

describe('Controlador de Vendas', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Obter venda por ID', () => {
    it('deve devolver a venda quando encontrada', async () => {
      const req = { params: { id: '1' } }
      const res = {}
      const saleMock = { Artigo_ID: '1', Titulo: 'Venda de Teste' }
      const saleWithPhotosMock = { ...saleMock, photos: [{ url: 'foto.jpg' }] }

      SaleRepository.getSaleById.mockResolvedValue(saleMock)

      const attachPhotosSpy = vi.spyOn(SaleController, 'attachPhotosToSale')
        .mockResolvedValue(saleWithPhotosMock)

      await SaleController.getSaleById(req, res)

      expect(SaleRepository.getSaleById).toHaveBeenCalledWith('1')

      expect(attachPhotosSpy).toHaveBeenCalledWith(saleMock)

      expect(response).toHaveBeenCalledWith(
        res,
        true,
        StatusCodes.OK,
        saleWithPhotosMock
      )
    })
  })

  describe('Obter vendas de um utilizador', () => {
    it('deve devolver erro se falhar a buscar vendas do utilizador', async () => {
      const req = { user: { Utilizador_ID: '123' } }
      const res = {}

      SaleRepository.getUserSales.mockRejectedValue(new Error('Erro ao buscar vendas'))

      await SaleController.getUserSales(req, res)

      expect(handleError).toHaveBeenCalled()
    })
  })

  describe('Obter vendas concluídas de um utilizador', () => {
    it('deve devolver as vendas concluídas do utilizador', async () => {
      const req = { user: { Utilizador_ID: '456' } }
      const res = {}
      const completedSalesMock = [{ Artigo_ID: '3', Titulo: 'Venda Concluída' }]
      const photoMock = [{ url: 'fotoConcluida.jpg' }]

      SaleRepository.getCompletedSalesByUser.mockResolvedValue(completedSalesMock)

      ItemRepository.getItemPhoto.mockResolvedValueOnce(photoMock)

      await SaleController.getCompletedSalesByUser(req, res)

      expect(SaleRepository.getCompletedSalesByUser).toHaveBeenCalledWith('456')

      expect(ItemRepository.getItemPhoto).toHaveBeenCalledWith('3')

      expect(response).toHaveBeenCalledWith(res, true, StatusCodes.OK, [
        { ...completedSalesMock[0], photos: photoMock[0] }
      ])
    })

    it('deve devolver erro se falhar a buscar vendas concluídas', async () => {
      const req = { user: { Utilizador_ID: '456' } }
      const res = {}

      SaleRepository.getCompletedSalesByUser.mockRejectedValue(new Error('Erro'))

      await SaleController.getCompletedSalesByUser(req, res)

      expect(handleError).toHaveBeenCalled()
    })
  })
})
