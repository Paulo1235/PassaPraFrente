import { describe, it, expect, vi, beforeEach } from 'vitest'
import ProposalLoanController from '../../src/controllers/proposal-loan-controller.js'
import ProposalLoanRepository from '../../src/repositories/proposal-loan-repository.js'

vi.mock('../../src/repositories/proposal-loan-repository.js')
vi.mock('../../src/repositories/loan-repository.js')

const criarMockRes = () => {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn()
  }
}

describe('Propostas de empréstimo - Obtenção de propostas', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('Deve retornar todas as propostas com sucesso', async () => {
    const mockProposals = [{ id: 1 }, { id: 2 }]
    ProposalLoanRepository.getAllLoanProposals.mockResolvedValue(mockProposals)
    const req = {}
    const res = criarMockRes()

    await ProposalLoanController.getAllLoanProposals(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ success: true, message: mockProposals })
  })

  it('Deve retornar uma proposta específica com sucesso', async () => {
    const req = { params: { userId: '1', loanId: '2' } }
    const res = criarMockRes()
    const proposal = { id: 1 }
    ProposalLoanRepository.getLoanProposalById.mockResolvedValue(proposal)

    await ProposalLoanController.getLoanProposalById(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ success: true, message: proposal })
  })

  it('Deve retornar as propostas de um utilizador com sucesso', async () => {
    const req = { user: { Utilizador_ID: 1 } }
    const res = criarMockRes()
    const proposals = [{ id: 1 }, { id: 2 }]
    ProposalLoanRepository.getLoanProposalsByUser.mockResolvedValue(proposals)

    await ProposalLoanController.getLoanProposalsByUser(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ success: true, message: proposals })
  })
})
