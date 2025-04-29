import { describe, it, beforeEach, vi, expect } from 'vitest'
import ProposalLoanController from '../../src/controllers/proposal-loan-controller.js'
import ProposalLoanRepository from '../../src/repositories/proposal-loan-repository.js'
import LoanRepository from '../../src/repositories/loan-repository.js'
import NotificationController from '../../src/controllers/notification-controller.js'
import TransactionLoanController from '../../src/controllers/transaction-loan-controller.js'
import { PROPOSAL_LOAN_STATES } from '../../src/constants/status-constants.js'

vi.mock('../../src/repositories/proposal-loan-repository.js')
vi.mock('../../src/repositories/loan-repository.js')
vi.mock('../../src/controllers/notification-controller.js')
vi.mock('../../src/controllers/transaction-loan-controller.js')

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

describe('Atualizar Proposta de Empréstimo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve atualizar o estado da proposta para aceite e criar transação', async () => {
    const reqData = {
      id: 1,
      userId: 2
    }

    const bodyData = {
      status: PROPOSAL_LOAN_STATES.ACEITE
    }

    const user = { Utilizador_ID: 3 }

    const loanMock = {
      Estado: 'Disponível',
      Titulo: 'Empréstimo Teste',
      DataInicio: new Date().toISOString(),
      DataFim: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // daqui a 7 dias
    }

    const proposalMock = { Aceite: 0, NovoValor: 1500, NovaDataInicio: new Date('2023-05-01'), NovaDataFim: new Date('2023-11-30') }

    LoanRepository.getLoanById.mockResolvedValue(loanMock)

    ProposalLoanRepository.getLoanProposalById.mockResolvedValue(proposalMock)

    ProposalLoanRepository.updateProposalLoanStatus.mockResolvedValue()

    NotificationController.createNotification.mockResolvedValue()

    TransactionLoanController.createTransactionLoan.mockResolvedValue()

    const { req, res } = criarMockReqRes(reqData, bodyData, user)

    await ProposalLoanController.updateProposalLoanStatus(req, res)

    // Verifica chamadas dos repositórios e controladores
    expect(LoanRepository.getLoanById).toHaveBeenCalledWith('1')

    expect(ProposalLoanRepository.updateProposalLoanStatus).toHaveBeenCalledWith('2', '1', PROPOSAL_LOAN_STATES.ACEITE)

    expect(NotificationController.createNotification).toHaveBeenCalled()

    expect(TransactionLoanController.createTransactionLoan).toHaveBeenCalledWith(
      1500,
      2,
      1,
      proposalMock.NovaDataInicio,
      proposalMock.NovaDataFim
    )

    // Verifica a resposta
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Estado da proposta atualizado.' })
  })
})
