import { describe, it, expect, vi, beforeEach } from 'vitest'
import { StatusCodes } from 'http-status-codes'
import TransactionLoanController from '../../src/controllers/transaction-loan-controller.js'
import LoanRepository from '../../src/repositories/loan-repository.js'
import ProposalLoanRepository from '../../src/repositories/proposal-loan-repository.js'
import TransactionLoanRepository from '../../src/repositories/transaction-loan-repository.js'
import { PROPOSAL_LOAN_STATES } from '../../src/constants/status-constants.js'

vi.mock('../../src/repositories/loan-repository.js')
vi.mock('../../src/repositories/proposal-loan-repository.js')
vi.mock('../../src/repositories/transaction-loan-repository.js')
vi.mock('../../src/controllers/notification-controller.js')

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

describe('Transações de Empréstimo - Criação de transação', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve criar uma transação de empréstimo com sucesso', async () => {
    const reqData = { id: 1 }
    const bodyData = { status: 'Aceite' }
    const user = { Utilizador_ID: 2 }

    const loanMock = { Estado: 'Disponível', Valor: 1500, Utilizador_ID: 3 }
    const proposalMock = { Aceite: PROPOSAL_LOAN_STATES.ACEITE }

    LoanRepository.getLoanById.mockResolvedValue(loanMock)
    ProposalLoanRepository.createProposalLoan.mockResolvedValue(proposalMock)
    TransactionLoanRepository.createTransactionLoan.mockResolvedValue({ TransacaoEmprestimo_ID: 1 })

    const { req, res } = criarMockReqRes(reqData, bodyData, user)

    await TransactionLoanController.createDirectTransactionLoan(req, res)

    expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED)

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Transação criada com sucesso.'
    })
  })
})
