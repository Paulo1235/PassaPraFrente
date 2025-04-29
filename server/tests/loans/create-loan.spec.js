import { describe, it, expect, vi, beforeEach } from 'vitest'
import ItemController from '../../src/controllers/item-controller.js'
import LoanRepository from '../../src/repositories/loan-repository.js'
import response from '../../src/utils/response.js'
import { StatusCodes } from 'http-status-codes'
import LoanController from '../../src/controllers/loan-controller.js'

vi.mock('../../src/controllers/item-controller.js', () => ({
  default: {
    createItem: vi.fn()
  }
}))

vi.mock('../../src/repositories/loan-repository.js', () => ({
  default: {
    createLoan: vi.fn()
  }
}))

vi.mock('../../src/utils/response.js', () => ({
  default: vi.fn()
}))

describe('Criar empréstimo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve criar um empréstimo com sucesso', async () => {
    const req = {
      user: { Utilizador_ID: 1 },
      body: { title: 'Produto', preco: 100 }
    }
    const res = {}

    const fakeItem = { Artigo_ID: 99 }

    ItemController.createItem.mockResolvedValue(fakeItem)
    LoanRepository.createLoan.mockResolvedValue(true)

    await LoanController.createLoan(req, res)

    expect(ItemController.createItem).toHaveBeenCalledWith(req.body)
    expect(LoanRepository.createLoan).toHaveBeenCalledWith(fakeItem, req.body, req.user.Utilizador_ID)

    expect(response).toHaveBeenCalledWith(res, true, StatusCodes.CREATED, 'Empréstimo criado com sucesso')
  })
})
