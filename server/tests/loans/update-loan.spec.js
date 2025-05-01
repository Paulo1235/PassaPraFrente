import { describe, it, expect, vi, beforeEach } from 'vitest'
import { StatusCodes } from 'http-status-codes'

import LoanController from '../../src/controllers/loan-controller.js'
import LoanRepository from '../../src/repositories/loan-repository.js'
import response from '../../src/utils/response.js'
import { LOAN_STATES } from '../../src/constants/status-constants.js'

vi.mock('../../src/repositories/loan-repository.js', () => ({
  default: {
    getLoanById: vi.fn(),
    updateLoan: vi.fn(),
    updateLoanStatus: vi.fn()
  }
}))

vi.mock('../../src/utils/response.js', () => ({
  default: vi.fn()
}))

describe('Operações de atualizar em empréstimos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Teste para updateLoan
  it('atualiza o empréstimo com sucesso', async () => {
    const req = {
      params: { id: 1 },
      body: {
        description: 'Descrição atualizada'
        // os outros campos ficam em branco
      }
    }

    const res = {}

    const loan = {
      Titulo: 'Título antigo',
      Descricao: 'Desc',
      Valor: 10,
      ArtigoArtigo_ID: 99,
      NomeCategoria: 'Eletrónicos',
      Condicao: 'Quase Novo',
      DataInicio: new Date().toISOString(),
      DataFim: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // daqui a 7 dias
    }

    LoanRepository.getLoanById.mockResolvedValue(loan)
    LoanRepository.updateLoan.mockResolvedValue()

    await LoanController.updateLoan(req, res)

    expect(LoanRepository.updateLoan).toHaveBeenCalledWith(
      expect.objectContaining({ description: 'Descrição atualizada' }),
      1
    )
    expect(response).toHaveBeenCalledWith(res, true, StatusCodes.OK, 'Empréstimo atualizado com sucesso.')
  })

  it('deve lançar erro se o empréstimo não for encontrada', async () => {
    const req = { params: { id: 99 } }
    const res = {}

    LoanRepository.getLoanById.mockResolvedValue(null)

    await LoanController.updateLoan(req, res)

    expect(response).toHaveBeenCalledWith(res, false, StatusCodes.NOT_FOUND, 'Empréstimo não encontrado.')
  })

  it('deve lançar erro se o empréstimo já estiver concluído', async () => {
    const req = { params: { id: 1 }, body: { title: 'Updated Title' } }
    const res = {}
    const loan = { id: 1, Estado_ID: LOAN_STATES.CONCLUIDO, ArtigoArtigo_ID: 123 }

    LoanRepository.getLoanById.mockResolvedValue(loan)

    await LoanController.updateLoan(req, res)

    expect(response).toHaveBeenCalledWith(res, false, StatusCodes.BAD_REQUEST, 'Já não pode alterar este empréstimo')
  })

  // Teste para updateLoanStatus
  it('deve atualizar o estado de empréstimo com sucesso', async () => {
    const req = { params: { id: 1 }, body: { status: 'Disponível' } }
    const res = {}
    const loan = { id: 1, Estado: 'Em análise' }

    LoanRepository.getLoanById.mockResolvedValue(loan)

    LoanRepository.updateLoanStatus.mockResolvedValue(true)

    await LoanController.updateLoanStatus(req, res)

    expect(LoanRepository.updateLoanStatus).toHaveBeenCalledWith(1, 3)

    expect(response).toHaveBeenCalledWith(res, true, StatusCodes.OK, 'Estado do empréstimo atualizado.')
  })

  it('deve lançar erro se o estado for inválido', async () => {
    const req = { params: { id: 1 }, body: { status: 999 } }
    const res = {}
    const loan = { id: 1 }

    LoanRepository.getLoanById.mockResolvedValue(loan)

    await LoanController.updateLoanStatus(req, res)

    expect(response).toHaveBeenCalledWith(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao atualizar o estado do empréstimo.')
  })
})
