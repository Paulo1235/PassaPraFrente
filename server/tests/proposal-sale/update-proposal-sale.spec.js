import { describe, it, beforeEach, vi, expect } from 'vitest'
import ProposalSaleController from '../../src/controllers/proposal-sale-controller.js'
import ProposalSaleRepository from '../../src/repositories/proposal-sale-repository.js'
import SaleRepository from '../../src/repositories/sale-repository.js'
import NotificationController from '../../src/controllers/notification-controller.js'
import TransactionSaleController from '../../src/controllers/transaction-sale-controller.js'
import { PROPOSAL_SALE_STATES } from '../../src/constants/status-constants.js'

vi.mock('../../src/repositories/proposal-sale-repository.js')
vi.mock('../../src/repositories/sale-repository.js')
vi.mock('../../src/controllers/notification-controller.js')
vi.mock('../../src/controllers/transaction-sale-controller.js')

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

describe('Atualizar Proposta de venda', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve atualizar o estado da proposta para aceite e criar transação', async () => {
    const reqData = {
      id: 1,
      userId: 2
    }

    const bodyData = {
      status: PROPOSAL_SALE_STATES.ACEITE
    }

    const user = { Utilizador_ID: 3 }

    const saleMock = { Estado: 'Disponível', Titulo: 'Venda Teste' }

    const proposalMock = { Aceite: 0, NovoValor: 150 }

    SaleRepository.getSaleById.mockResolvedValue(saleMock)

    ProposalSaleRepository.getSaleProposalById.mockResolvedValue(proposalMock)

    ProposalSaleRepository.updateProposalSaleStatus.mockResolvedValue()

    NotificationController.createNotification.mockResolvedValue()

    TransactionSaleController.createTransactionSale.mockResolvedValue()

    const { req, res } = criarMockReqRes(reqData, bodyData, user)

    await ProposalSaleController.updateProposalSaleStatus(req, res)

    expect(SaleRepository.getSaleById).toHaveBeenCalledWith(1)

    expect(ProposalSaleRepository.updateProposalSaleStatus).toHaveBeenCalledWith(2, 1, PROPOSAL_SALE_STATES.ACEITE)

    expect(NotificationController.createNotification).toHaveBeenCalled()

    expect(TransactionSaleController.createTransactionSale).toHaveBeenCalledWith(150, 2, 1)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Proposta atualizada' })
  })
})
