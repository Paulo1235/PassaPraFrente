import { describe, it, expect, vi } from 'vitest'
import LoanRepository from '../../src/repositories/loan-repository.js'
import OwnerMiddleware from '../../src/middlewares/owner-middleware.js'
import { StatusCodes } from 'http-status-codes'
import response from '../../src/utils/response.js'

vi.mock('../../src/repositories/loan-repository.js', () => ({
  default: {
    getLoanById: vi.fn()
  }
}))

vi.mock('../../src/utils/response.js', () => ({
  default: vi.fn()
}))

describe('testes relacionados com a verificação se é dono do empréstimo', () => {
  it('deve retornar next se for o dono do empréstimo', async () => {
    const req = { user: { Utilizador_ID: 1 }, params: { id: 5 } }
    const res = {}
    const next = vi.fn()

    const fakeLoan = { Utilizador_ID: 1 }
    LoanRepository.getLoanById.mockResolvedValue(fakeLoan)
    await OwnerMiddleware.isOwnerLoan(req, res, next)
    expect(next).toHaveBeenCalled()
  })

  it('não deve retornar next se não for o dono do empréstimo', async () => {
    const req = { user: { Utilizador_ID: 5 }, params: { id: 5 } }
    const res = {}
    const next = vi.fn()

    const fakeLoan = { Utilizador_ID: 1 }
    LoanRepository.getLoanById.mockResolvedValue(fakeLoan)
    await OwnerMiddleware.isOwnerLoan(req, res, next)
    expect(response).toHaveBeenCalledWith(
      res,
      false,
      StatusCodes.UNAUTHORIZED,
      'Não é o dono deste empréstimo!'
    )
  })
})
