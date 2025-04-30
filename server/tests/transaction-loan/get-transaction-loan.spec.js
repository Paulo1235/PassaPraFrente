import { describe, it, expect, vi, beforeEach } from 'vitest'
import { StatusCodes } from 'http-status-codes'

import TransactionLoanController from '../../src/controllers/transaction-loan-controller.js'
import TransactionLoanRepository from '../../src/repositories/transaction-loan-repository.js'

vi.mock('../../src/repositories/transaction-loan-repository.js')

function criarMockReqRes (params, user) {
  const req = {
    params,
    user
  }

  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis()
  }

  return { req, res }
}

describe('Transações de Empréstimo - Busca por ID', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve retornar a transação de empréstimo com sucesso', async () => {
    const transactionsMock = [{ TransacaoEmprestimo_ID: 1, Valor: 1500 }]

    TransactionLoanRepository.getAllLoanTransactions.mockResolvedValue(transactionsMock)
    const { req, res } = criarMockReqRes({}, {}, {})

    await TransactionLoanController.getAllLoanTransactions(req, res)

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: transactionsMock
    })
  })

  it('deve retornar a transação de empréstimo por ID com sucesso', async () => {
    const reqData = { id: 1, userId: 2 }
    const user = { Utilizador_ID: 2 }
    const transactionMock = { EmprestimoVenda_ID: 1, Valor: 1500, Utilizador_ID: 2 }

    TransactionLoanRepository.getLoanTransactionById.mockResolvedValue(transactionMock)

    const { req, res } = criarMockReqRes(reqData, {}, user)

    await TransactionLoanController.getLoanTransactionById(req, res)

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: transactionMock
    })
  })

  it('deve retornar erro caso a transação de empréstimo não seja encontrada', async () => {
    const reqData = { id: 1, userId: 2 }
    const user = { Utilizador_ID: 2 }

    TransactionLoanRepository.getLoanTransactionById.mockResolvedValue(null)

    const { req, res } = criarMockReqRes(reqData, {}, user)

    await TransactionLoanController.getLoanTransactionById(req, res)

    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Transação não encontrada!'
    })
  })
})
