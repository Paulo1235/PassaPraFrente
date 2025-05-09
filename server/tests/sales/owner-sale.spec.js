import { describe, it, expect, vi } from 'vitest'
import SaleRepository from '../../src/repositories/sale-repository.js'
import OwnerMiddleware from '../../src/middlewares/owner-middleware.js'
import { StatusCodes } from 'http-status-codes'
import response from '../../src/utils/response.js'

vi.mock('../../src/repositories/sale-repository.js', () => ({
  default: {
    getSaleById: vi.fn()
  }
}))

vi.mock('../../src/utils/response.js', () => ({
  default: vi.fn()
}))

describe('testes relacionados com a verificação se é dono da venda', () => {
  it('deve retornar next se for o dono da venda', async () => {
    const req = { user: { Utilizador_ID: 1 }, params: { id: 5 } }
    const res = {}
    const next = vi.fn()

    const fakeSale = { Utilizador_ID: 1 }
    SaleRepository.getSaleById.mockResolvedValue(fakeSale)
    await OwnerMiddleware.isOwnerSale(req, res, next)
    expect(next).toHaveBeenCalled()
  })

  it('não deve retornar next se não for o dono da venda', async () => {
    const req = { user: { Utilizador_ID: 5 }, params: { id: 5 } }
    const res = {}
    const next = vi.fn()

    const fakeSale = { Utilizador_ID: 1 }
    SaleRepository.getSaleById.mockResolvedValue(fakeSale)
    await OwnerMiddleware.isOwnerSale(req, res, next)
    expect(response).toHaveBeenCalledWith(
      res,
      false,
      StatusCodes.UNAUTHORIZED,
      'Não é o dono desta venda!'
    )
  })
})
