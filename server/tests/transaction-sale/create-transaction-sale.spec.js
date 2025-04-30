import { describe, it, vi, expect, beforeEach } from 'vitest'
import TransactionSaleController from '../../src/controllers/transaction-sale-controller.js'
import SaleRepository from '../../src/repositories/sale-repository.js'
import ProposalSaleRepository from '../../src/repositories/proposal-sale-repository.js'
import TransactionSaleRepository from '../../src/repositories/transaction-sale-repository.js'
import { StatusCodes } from 'http-status-codes'
import { PROPOSAL_SALE_STATES } from '../../src/constants/status-constants.js'

vi.mock('../../src/repositories/sale-repository.js')
vi.mock('../../src/repositories/proposal-sale-repository.js')
vi.mock('../../src/repositories/transaction-sale-repository.js')
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

describe('Criar Transação de Venda', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve criar uma transação com sucesso', async () => {
    const reqData = { id: 1 }
    const bodyData = { status: 'Aceite' }
    const user = { Utilizador_ID: 2 }

    const saleMock = { Estado: 'Disponível', Valor: 1500, Utilizador_ID: 3 }
    const proposalMock = { Aceite: PROPOSAL_SALE_STATES.ACEITE }

    SaleRepository.getSaleById.mockResolvedValue(saleMock)
    ProposalSaleRepository.createProposalSale.mockResolvedValue(proposalMock)
    TransactionSaleRepository.createTransactionSale.mockResolvedValue({ TransacaoVenda_ID: 1 })

    const { req, res } = criarMockReqRes(reqData, bodyData, user)

    await TransactionSaleController.createDirectTransactionSale(req, res)

    expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED)
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Transação criada com sucesso.'
    })
  })

  it('não deve criar transação se a venda estiver concluída', async () => {
    const reqData = { id: 1 }
    const user = { Utilizador_ID: 2 }
    const saleMock = { Estado: 'Concluído', Valor: 1500, Utilizador_ID: 3 }

    SaleRepository.getSaleById.mockResolvedValue(saleMock)

    const { req, res } = criarMockReqRes(reqData, {}, user)

    await TransactionSaleController.createDirectTransactionSale(req, res)

    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Não pode criar uma transação nesta venda.'
    })
  })
})
