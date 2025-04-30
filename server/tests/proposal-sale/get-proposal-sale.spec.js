import { describe, it, expect, vi, beforeEach } from 'vitest'
import ProposalSaleController from '../../src/controllers/proposal-sale-controller.js'
import ProposalSaleRepository from '../../src/repositories/proposal-sale-repository.js'
import SaleRepository from '../../src/repositories/sale-repository.js'

vi.mock('../../src/repositories/proposal-sale-repository.js')
vi.mock('../../src/repositories/sale-repository.js')

const criarMockRes = () => {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn()
  }
}

describe('Propostas de venda - Obtenção de propostas', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('Deve retornar todas as propostas com sucesso', async () => {
    const mockProposals = [{ id: 1 }, { id: 2 }]
    ProposalSaleRepository.getAllSaleProposals.mockResolvedValue(mockProposals)
    const req = {}
    const res = criarMockRes()

    await ProposalSaleController.getAllSaleProposals(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ success: true, message: mockProposals })
  })

  it('Deve retornar uma proposta específica com sucesso', async () => {
    const req = { params: { userId: 1, saleId: 2 } }
    const res = criarMockRes()

    const proposal = { id: 1 }

    ProposalSaleRepository.getSaleProposalById.mockResolvedValue(proposal)

    await ProposalSaleController.getSaleProposalById(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ success: true, message: proposal })
  })

  it('Deve retornar as propostas de um utilizador com sucesso', async () => {
    const req = { user: { Utilizador_ID: 1 } }
    const res = criarMockRes()

    const proposals = [{ id: 1 }, { id: 2 }]

    ProposalSaleRepository.getSaleProposalsByUser.mockResolvedValue(proposals)

    await ProposalSaleController.getSaleProposalsByUser(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ success: true, message: proposals })
  })

  it('Deve retornar todas as entradas de propostas por venda do utilizador', async () => {
    const req = { user: { Utilizador_ID: 1 } }
    const res = criarMockRes()

    const sales = [{ Emprestimo_ID: 1 }, { Emprestimo_ID: 2 }]

    const proposal = { id: 1 }

    SaleRepository.getUserSales.mockResolvedValue(sales)

    ProposalSaleRepository.getSaleProposalBySaleId.mockResolvedValue(proposal)

    await ProposalSaleController.getAllProposalEntriesBySale(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ success: true, message: sales })
  })
})
