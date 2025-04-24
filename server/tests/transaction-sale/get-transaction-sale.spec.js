import { describe, it, vi, expect, beforeEach } from 'vitest'
import TransactionSaleController from '../../src/controllers/transaction-sale-controller.js'
import TransactionSaleRepository from '../../src/repositories/transaction-sale-repository.js'
import { StatusCodes } from 'http-status-codes'

vi.mock('../../src/repositories/transaction-sale-repository.js')

function criarMockReqRes (params, body, user) {
  const req = {
    params,
    body,
    user
  }
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis()
  }
  return { req, res }
}

describe('Obter Transações de Venda', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve retornar todas as transações de venda com sucesso', async () => {
    const transactionsMock = [{ TransacaoVenda_ID: 1, Valor: 1500 }]

    TransactionSaleRepository.getAllSaleTransactions.mockResolvedValue(transactionsMock)
    const { req, res } = criarMockReqRes({}, {}, {})

    await TransactionSaleController.getAllSaleTransactions(req, res)

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: transactionsMock
    })
  })

  it('deve retornar a transação de venda por ID com sucesso', async () => {
    const reqData = { id: '1', userId: '2' }
    const user = { Utilizador_ID: '2' }
    const transactionMock = { TransacaoVenda_ID: 1, Valor: 1500, Utilizador_ID: '2' }

    TransactionSaleRepository.getSaleTransactionById.mockResolvedValue(transactionMock)

    const { req, res } = criarMockReqRes(reqData, {}, user)

    await TransactionSaleController.getSaleTransactionById(req, res)

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: transactionMock
    })
  })

  it('deve retornar erro caso a transação de venda não seja encontrada', async () => {
    const reqData = { id: '1', userId: '2' }
    const user = { Utilizador_ID: '2' }

    TransactionSaleRepository.getSaleTransactionById.mockResolvedValue(null)

    const { req, res } = criarMockReqRes(reqData, {}, user)

    await TransactionSaleController.getSaleTransactionById(req, res)

    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Transação não encontrada!'
    })
  })
})
