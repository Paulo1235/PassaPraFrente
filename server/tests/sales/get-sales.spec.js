import { describe, it, expect, vi, beforeEach } from 'vitest'
import SaleController from '../../src/controllers/sale-controller.js'
import SaleRepository from '../../src/repositories/sale-repository.js'
import response from '../../src/utils/response.js'
import { StatusCodes } from 'http-status-codes'

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

vi.mock('../../src/utils/response.js', () => ({
  default: vi.fn()
}))

vi.mock('../../src/controllers/sale-controller.js', async () => {
  const actual = await vi.importActual('../../src/controllers/sale-controller.js')
  return {
    default: {
      ...actual.default,
      attachFirstPhotoToSales: vi.fn(sales => sales),
      attachPhotosToSale: vi.fn(sale => sale),
      // Inclui todas as funções que estás a testar
      getSaleById: actual.default.getSaleById,
      getAllSales: actual.default.getAllSales,
      getAvailableSales: actual.default.getAvailableSales,
      getPendingSales: actual.default.getPendingSales,
      getUserSales: actual.default.getUserSales,
      getNonCompletedSalesByUser: actual.default.getNonCompletedSalesByUser,
      getCompletedSalesByUser: actual.default.getCompletedSalesByUser
    }
  }
})

describe('SaleController', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getSaleById - deve retornar a venda com fotos', async () => {
    const req = { params: { id: 1 } }
    const res = {}
    const sale = { id: 1 }

    SaleRepository.getSaleById.mockResolvedValue(sale)

    await SaleController.getSaleById(req, res)

    expect(response).toHaveBeenCalledWith(res, true, StatusCodes.OK, sale)
  })

  it('getAllSales - deve retornar todas as vendas com fotos', async () => {
    const req = {}
    const res = {}
    const sales = [{ id: 1 }, { id: 2 }]

    SaleRepository.getAllSales.mockResolvedValue(sales)

    await SaleController.getAllSales(req, res)

    expect(response).toHaveBeenCalledWith(res, true, StatusCodes.OK, sales)
  })

  it('getAvailableSales - deve retornar vendas disponíveis com fotos', async () => {
    const req = {}
    const res = {}
    const sales = [{ id: 1 }]

    SaleRepository.getAvailableSales.mockResolvedValue(sales)

    await SaleController.getAvailableSales(req, res)

    expect(response).toHaveBeenCalledWith(res, true, StatusCodes.OK, sales)
  })

  it('getPendingSales - deve retornar vendas pendentes com fotos', async () => {
    const req = {}
    const res = {}
    const sales = [{ id: 1 }]

    SaleRepository.getPendingSales.mockResolvedValue(sales)

    await SaleController.getPendingSales(req, res)

    expect(response).toHaveBeenCalledWith(res, true, StatusCodes.OK, sales)
  })

  it('getUserSales - deve retornar vendas do utilizador com fotos', async () => {
    const req = { user: { Utilizador_ID: 1 } }
    const res = {}
    const sales = [{ id: 1 }]

    SaleRepository.getUserSales.mockResolvedValue(sales)

    await SaleController.getUserSales(req, res)

    expect(response).toHaveBeenCalledWith(res, true, StatusCodes.OK, sales)
  })

  it('getNonCompletedSalesByUser - deve retornar vendas não completas', async () => {
    const req = { user: { Utilizador_ID: 1 } }
    const res = {}
    const sales = [{ id: 1 }]

    SaleRepository.getNonCompletedSalesByUser.mockResolvedValue(sales)

    await SaleController.getNonCompletedSalesByUser(req, res)

    expect(response).toHaveBeenCalledWith(res, true, StatusCodes.OK, sales)
  })

  it('getCompletedSalesByUser - deve retornar vendas completas', async () => {
    const req = { user: { Utilizador_ID: 1 } }
    const res = {}
    const sales = [{ id: 1 }]

    SaleRepository.getCompletedSalesByUser.mockResolvedValue(sales)

    await SaleController.getCompletedSalesByUser(req, res)

    expect(response).toHaveBeenCalledWith(res, true, StatusCodes.OK, sales)
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
