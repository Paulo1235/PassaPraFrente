import { describe, it, expect, vi, beforeEach } from 'vitest'
import ProposalLoanController from '../../src/controllers/proposal-loan-controller.js'
import ProposalLoanRepository from '../../src/repositories/proposal-loan-repository.js'
import LoanRepository from '../../src/repositories/loan-repository.js'

vi.mock('../../src/repositories/proposal-loan-repository.js')
vi.mock('../../src/repositories/loan-repository.js')

const criaReqRes = (overrides = {}) => {
  return {
    req: {
      body: { price: 1000, newStartDate: '2025-06-01', newEndDate: '2025-07-01' },
      user: { Utilizador_ID: 1 },
      params: { id: 10 },
      ...overrides.req
    },
    res: {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      setHeader: vi.fn()
    }
  }
}

describe('Criar proposta de empréstimo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve criar uma nova proposta com sucesso', async () => {
    const { req, res } = criaReqRes()

    LoanRepository.getLoanById.mockResolvedValue({
      Estado: 'Disponível',
      Utilizador_ID: 2,
      Valor: 800,
      DataInicio: '2025-06-01',
      DataFim: '2025-07-01'
    })

    ProposalLoanRepository.getLoanProposalById.mockResolvedValue(null)
    ProposalLoanRepository.createProposalLoan.mockResolvedValue()

    await ProposalLoanController.createProposalLoan(req, res)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Proposta de empréstimo criada com sucesso.' })
  })

  it('não deve permitir proposta para o próprio empréstimo', async () => {
    const { req, res } = criaReqRes()

    LoanRepository.getLoanById.mockResolvedValue({
      Estado: 'Disponível',
      Utilizador_ID: 1,
      DataInicio: '2025-06-01',
      DataFim: '2025-07-01'
    })

    await ProposalLoanController.createProposalLoan(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Não é possível fazer uma proposta para o seu próprio empréstimo.' })
  })

  it('não deve permitir nova proposta se já existir uma', async () => {
    const { req, res } = criaReqRes()

    LoanRepository.getLoanById.mockResolvedValue({
      Estado: 'Disponível',
      Utilizador_ID: 2,
      DataInicio: '2025-06-01',
      DataFim: '2025-07-01'
    })

    ProposalLoanRepository.getLoanProposalById.mockResolvedValue({ id: 1 })

    await ProposalLoanController.createProposalLoan(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Já fez uma proposta para este empréstimo.' })
  })
})
