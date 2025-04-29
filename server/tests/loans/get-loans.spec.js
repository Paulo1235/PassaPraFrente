import { describe, it, expect, vi, beforeEach } from 'vitest'
import LoanController from '../../src/controllers/loan-controller.js'
import LoanRepository from '../../src/repositories/loan-repository.js'
import ItemRepository from '../../src/repositories/item-repository.js'
import { StatusCodes } from 'http-status-codes'
import response from '../../src/utils/response.js'
import { handleError } from '../../src/utils/error-handler.js'

vi.mock('../../src/repositories/loan-repository.js', () => ({
  default: {
    getLoanById: vi.fn(),
    getCompletedLoansByUser: vi.fn(),
    getUserLoans: vi.fn()
  }
}))

vi.mock('../../src/repositories/item-repository.js', () => ({
  default: {
    getItemPhoto: vi.fn()
  }
}))

vi.mock('../../src/utils/response.js', () => ({
  default: vi.fn()
}))

vi.mock('../../src/utils/error-handler.js', () => ({
  handleError: vi.fn()
}))

describe('Operações GET para obter empréstimos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Obter empréstimo por ID', () => {
    it('deve devolver o empréstimo quando encontrado', async () => {
      const req = { params: { id: 1 } }
      const res = {}
      const loanMock = { ArtigoArtigo_ID: 1, Titulo: 'Empréstimo de Teste' }
      const loanWithPhotosMock = { ...loanMock, photos: [{ url: 'foto.jpg' }] }

      LoanRepository.getLoanById.mockResolvedValue(loanMock)

      const attachPhotosSpy = vi.spyOn(LoanController, 'attachPhotosToLoan')
        .mockResolvedValue(loanWithPhotosMock)

      await LoanController.getLoanById(req, res)

      expect(LoanRepository.getLoanById).toHaveBeenCalledWith(1)

      expect(attachPhotosSpy).toHaveBeenCalledWith(loanMock)

      expect(response).toHaveBeenCalledWith(
        res,
        true,
        StatusCodes.OK,
        loanWithPhotosMock
      )
    })
  })

  describe('Obter empréstimos de um utilizador', () => {
    it('deve devolver erro se falhar a buscar empréstimos do utilizador', async () => {
      const req = { user: { Utilizador_ID: 123 } }
      const res = {}

      LoanRepository.getUserLoans.mockRejectedValue(new Error('Erro ao buscar empréstimos'))

      await LoanController.getUserLoans(req, res)

      expect(handleError).toHaveBeenCalled()
    })
  })

  describe('Obter empréstimos concluídos de um utilizador', () => {
    it('deve devolver os empréstimos concluídas do utilizador', async () => {
      const req = { user: { Utilizador_ID: 456 } }
      const res = {}
      const completedLoansMock = [{ ArtigoArtigo_ID: 3, Titulo: 'Empréstimo Concluída' }]
      const photoMock = [{ url: 'fotoConcluida.jpg' }]

      LoanRepository.getCompletedLoansByUser.mockResolvedValue(completedLoansMock)

      ItemRepository.getItemPhoto.mockResolvedValueOnce(photoMock)

      await LoanController.getCompletedLoansByUser(req, res)

      expect(LoanRepository.getCompletedLoansByUser).toHaveBeenCalledWith(456)

      expect(ItemRepository.getItemPhoto).toHaveBeenCalledWith(3)

      expect(response).toHaveBeenCalledWith(res, true, StatusCodes.OK, [
        { ...completedLoansMock[0], photos: photoMock[0] }
      ])
    })

    it('deve devolver erro se falhar a buscar empréstimos concluídos', async () => {
      const req = { user: { Utilizador_ID: 456 } }
      const res = {}

      LoanRepository.getCompletedLoansByUser.mockRejectedValue(new Error('Erro'))

      await LoanController.getCompletedLoansByUser(req, res)

      expect(handleError).toHaveBeenCalled()
    })
  })
})
