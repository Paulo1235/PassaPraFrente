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

describe('Criar Review para Transação de Venda', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve criar uma review com sucesso', async () => {
    const reqData = { id: 1 }
    const bodyData = { review: 1 }
    const user = { Utilizador_ID: 2 }

    const transactionMock = { PropostaVendaUtilizador_ID: user.Utilizador_ID, Nota: 0 }

    TransactionSaleRepository.getSaleTransactionByTransactionId.mockResolvedValue(transactionMock)
    TransactionSaleRepository.updateSaleReview.mockResolvedValue()

    const { req, res } = criarMockReqRes(reqData, bodyData, user)

    await TransactionSaleController.createReviewTransactionSale(req, res)

    expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED)
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Review da venda criada com sucesso.'
    })
  })

  it('não deve permitir review se a transação já foi avaliada', async () => {
    const reqData = { id: 1 }
    const bodyData = { review: 4 }
    const user = { Utilizador_ID: 2 }

    const transactionMock = { PropostaVendaUtilizador_ID: user.Utilizador_ID, Nota: 5 }

    TransactionSaleRepository.getSaleTransactionByTransactionId.mockResolvedValue(transactionMock)

    const { req, res } = criarMockReqRes(reqData, bodyData, user)

    await TransactionSaleController.createReviewTransactionSale(req, res)

    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Já efetuou review desta venda.'
    })
  })

  it('não deve permitir review se o utilizador não for o comprador', async () => {
    const reqData = { id: 1 }
    const bodyData = { review: 3 }
    const user = { Utilizador_ID: 3 }

    const transactionMock = { PropostaVendaUtilizador_ID: 2, Nota: 0 }

    TransactionSaleRepository.getSaleTransactionByTransactionId.mockResolvedValue(transactionMock)

    const { req, res } = criarMockReqRes(reqData, bodyData, user)

    await TransactionSaleController.createReviewTransactionSale(req, res)

    expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Não pode fazer review desta venda'
    })
  })
})
