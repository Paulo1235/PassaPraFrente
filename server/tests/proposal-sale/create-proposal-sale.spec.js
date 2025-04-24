import { describe, it, expect, vi, beforeEach } from 'vitest'
import ProposalSaleController from '../../src/controllers/proposal-sale-controller.js'
import ProposalSaleRepository from '../../src/repositories/proposal-sale-repository.js'
import SaleRepository from '../../src/repositories/sale-repository.js'

vi.mock('../../src/repositories/proposal-sale-repository.js')
vi.mock('../../src/repositories/sale-repository.js')

const criaReqRes = (overrides = {}) => {
  return {
    req: {
      body: { price: 1000 },
      user: { Utilizador_ID: 1 },
      params: { id: '10' },
      ...overrides.req
    },
    res: {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      setHeader: vi.fn()
    }
  }
}

describe('Criar proposta de venda', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve criar uma nova proposta com sucesso', async () => {
    const { req, res } = criaReqRes()

    SaleRepository.getSaleById.mockResolvedValue({
      Estado: 'Disponível',
      Utilizador_ID: 2
    })

    ProposalSaleRepository.getSaleProposalById.mockResolvedValue(null)

    ProposalSaleRepository.createProposalSale.mockResolvedValue()

    await ProposalSaleController.createProposalSale(req, res)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Proposta criada com sucesso.' })
  })

  it('não deve permitir proposta para a sua própria venda', async () => {
    const { req, res } = criaReqRes()

    SaleRepository.getSaleById.mockResolvedValue({
      Estado: 'Disponível',
      Utilizador_ID: 1
    })

    await ProposalSaleController.createProposalSale(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Não é possível fazer uma proposta para a sua própria venda.' })
  })

  it('não deve permitir proposta se já existir uma', async () => {
    const { req, res } = criaReqRes()

    SaleRepository.getSaleById.mockResolvedValue({
      Estado: 'Disponível',
      Utilizador_ID: 2
    })

    ProposalSaleRepository.getSaleProposalById.mockResolvedValue({ id: 1 })

    await ProposalSaleController.createProposalSale(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Já fez uma proposta para esta venda.' })
  })

  it('deve devolver erro se a venda não existir', async () => {
    const { req, res } = criaReqRes()

    SaleRepository.getSaleById.mockResolvedValue(null)

    await ProposalSaleController.createProposalSale(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Venda não encontrada.' })
  })
})
