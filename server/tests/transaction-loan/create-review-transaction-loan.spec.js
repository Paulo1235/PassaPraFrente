import { describe, it, vi, expect, beforeEach } from 'vitest'
import TransactionLoanController from '../../src/controllers/transaction-loan-controller.js'
import TransactionLoanRepository from '../../src/repositories/transaction-loan-repository.js'
import { StatusCodes } from 'http-status-codes'

vi.mock('../../src/repositories/transaction-loan-repository.js')

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

describe('Criar Review para Transação de Empréstimo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve criar uma review com sucesso', async () => {
    const reqData = { id: 1 }
    const bodyData = { review: 2 }
    const user = { Utilizador_ID: 2 }

    const transactionMock = { PropostaEmprestimoUtilizador_ID: user.Utilizador_ID, Nota: 0 }

    TransactionLoanRepository.getLoanTransactionByTransactionId.mockResolvedValue(transactionMock)
    TransactionLoanRepository.updateLoanReview.mockResolvedValue(true)

    const { req, res } = criarMockReqRes(reqData, bodyData, user)

    await TransactionLoanController.createReviewTransactionLoan(req, res)

    expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED)
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Review do empréstimo criada com sucesso.'
    })
  })

  it('não deve permitir review se a transação já foi avaliada', async () => {
    const reqData = { id: 1 }
    const bodyData = { review: 5 }
    const user = { Utilizador_ID: 2 }

    const transactionMock = { PropostaEmprestimoUtilizador_ID: user.Utilizador_ID, Nota: bodyData.review }

    TransactionLoanRepository.getLoanTransactionByTransactionId.mockResolvedValue(transactionMock)

    const { req, res } = criarMockReqRes(reqData, bodyData, user)

    await TransactionLoanController.createReviewTransactionLoan(req, res)

    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Já efetuou review deste empréstimo.'
    })
  })

  it('não deve permitir review se o utilizador não for o comprador', async () => {
    const reqData = { id: 1 }
    const bodyData = { review: 1 }
    const user = { Utilizador_ID: 3 }

    const transactionMock = { PropostaEmprestimoUtilizador_ID: 2, Nota: 0 }

    TransactionLoanRepository.getLoanTransactionByTransactionId.mockResolvedValue(transactionMock)

    const { req, res } = criarMockReqRes(reqData, bodyData, user)

    await TransactionLoanController.createReviewTransactionLoan(req, res)

    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Não pode fazer review deste empréstimo'
    })
  })
})
