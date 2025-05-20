import { StatusCodes } from 'http-status-codes'

import { handleError, HttpException } from '../utils/error-handler.js'
import response from '../utils/response.js'
import LoanRepository from '../repositories/loan-repository.js'
import ItemController from './item-controller.js'
import ItemRepository from '../repositories/item-repository.js'
import { LOAN_STATES } from '../constants/status-constants.js'
import StateRepository from '../repositories/state-repository.js'

class LoanController {
  static async createLoan (req, res) {
    const userId = req.user.Utilizador_ID
    const data = req.body

    try {
      if (new Date(data.startDate) >= new Date(data.endDate)) {
        throw new HttpException('A data de início deve ser anterior à data de fim.', StatusCodes.BAD_REQUEST)
      }

      const item = await ItemController.createItem(data)

      if (item) {
        await LoanRepository.createLoan(item, data, userId)
      }

      return response(res, true, StatusCodes.CREATED, 'Empréstimo criado com sucesso')
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao criar o empréstimo.')
    }
  }

  static async getLoanById (req, res) {
    const { id } = req.params

    try {
      const loan = await LoanRepository.getLoanById(id)

      if (!loan) {
        throw new HttpException('Empréstimo não encontrado.', StatusCodes.NOT_FOUND)
      }

      const loanWithPhotos = await LoanController.attachPhotosToLoan(loan)

      return response(res, true, StatusCodes.OK, loanWithPhotos)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar o empréstimo.')
    }
  }

  static async getAllLoans (req, res) {
    try {
      const loans = await LoanRepository.getAllLoans()

      const loansWithPhotos = await LoanController.attachFirstPhotoToLoans(loans)

      return response(res, true, StatusCodes.OK, loansWithPhotos)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar os empréstimos.')
    }
  }

  static async getAvailableLoans (req, res) {
    const userId = req.user.Utilizador_ID

    try {
      const loans = await LoanRepository.getAvailableLoans(userId)

      const loansWithPhotos = await LoanController.attachFirstPhotoToLoans(loans)

      return response(res, true, StatusCodes.OK, loansWithPhotos)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar os empréstimos disponíveis.')
    }
  }

  static async getPendingLoans (req, res) {
    try {
      const loans = await LoanRepository.getPendingLoans()

      const loansWithPhotos = await LoanController.attachFirstPhotoToLoans(loans)

      return response(res, true, StatusCodes.OK, loansWithPhotos)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar os empréstimos em análise.')
    }
  }

  static async updateLoan (req, res) {
    const { id } = req.params
    const data = req.body

    try {
      const existingLoan = await LoanRepository.getLoanById(id)

      if (!existingLoan) {
        throw new HttpException('Empréstimo não encontrado.', StatusCodes.NOT_FOUND)
      }

      if (existingLoan.Estado_ID === LOAN_STATES.CONCLUIDO || new Date(existingLoan.DataFim) < new Date()) {
        throw new HttpException('Já não pode alterar este empréstimo', StatusCodes.BAD_REQUEST)
      }

      const updatedData = {
        title: data.title || existingLoan.Titulo,
        description: data.description || existingLoan.Descricao,
        value: data.value || existingLoan.Valor,
        startDate: data.startDate || existingLoan.DataInicio,
        endDate: data.endDate || existingLoan.DataFim,
        category: data.category || existingLoan.NomeCategoria,
        condition: data.condition || existingLoan.Condicao,
        itemId: existingLoan.ArtigoArtigo_ID
      }

      await LoanRepository.updateLoan(updatedData, id)

      if (data.thumbnails) {
        await ItemController.replaceItemPhotos(updatedData.itemId, data.thumbnails)
      }

      return response(res, true, StatusCodes.OK, 'Empréstimo atualizado com sucesso.')
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao atualizar o empréstimo.')
    }
  }

  static async getUserLoans (req, res) {
    const id = req.user.Utilizador_ID

    try {
      const loans = await LoanRepository.getUserLoans(id)

      const loansWithPhotos = await LoanController.attachFirstPhotoToLoans(loans)

      return response(res, true, StatusCodes.OK, loansWithPhotos)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar os empréstimos do utilizador.')
    }
  }

  static async updateLoanStatus (req, res) {
    const { status } = req.body
    const { id } = req.params

    try {
      const loan = await LoanRepository.getLoanById(id)

      if (!loan) {
        throw new HttpException('Não foi possível encontrar o empréstimo.', StatusCodes.NOT_FOUND)
      }

      const stateId = await StateRepository.getStateById(status)

      if (!stateId) {
        throw new HttpException('Estado inválido.', StatusCodes.BAD_REQUEST)
      }

      await LoanRepository.updateLoanStatus(id, stateId)

      return response(res, true, StatusCodes.OK, 'Estado do empréstimo atualizado.')
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao atualizar o estado do empréstimo.')
    }
  }

  static async getNonCompletedLoansByUser (req, res) {
    const userId = req.user.Utilizador_ID

    try {
      const uncompletedLoans = await LoanRepository.getNonCompletedLoansByUser(userId)

      const loansWithPhotos = await LoanController.attachFirstPhotoToLoans(uncompletedLoans)

      return response(res, true, StatusCodes.OK, loansWithPhotos)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar os empréstimos não completos.')
    }
  }

  static async getCompletedLoansByUser (req, res) {
    const userId = req.user.Utilizador_ID

    try {
      const completedLoans = await LoanRepository.getCompletedLoansByUser(userId)

      const loansWithPhotos = await LoanController.attachFirstPhotoToLoans(completedLoans)

      return response(res, true, StatusCodes.OK, loansWithPhotos)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar os empréstimos completos.')
    }
  }

  static async attachPhotosToLoan (loan) {
    const photos = await ItemRepository.getItemPhoto(loan.ArtigoArtigo_ID)

    return {
      ...loan,
      photos
    }
  }

  static async attachFirstPhotoToLoans (loans) {
    const loansWithPhotos = []

    for (const loan of loans) {
      const photos = await ItemRepository.getItemPhoto(loan.ArtigoArtigo_ID)

      const firstPhoto = photos.length > 0 ? photos[0] : null

      loansWithPhotos.push({
        ...loan,
        photos: firstPhoto
      })
    }

    return loansWithPhotos
  }
}

export default LoanController
