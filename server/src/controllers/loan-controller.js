import { StatusCodes } from 'http-status-codes'

import { handleError, HttpException } from '../utils/error-handler.js'
import response from '../utils/response.js'
import LoanRepository from '../repositories/loan-repository.js'
import IdService from '../services/id-service.js'

class LoanController {
  static async createLoan (req, res) {
    const userId = req.user.Utilizador_ID
    const data = req.body

    try {
      await LoanRepository.createLoan({ data, userId })

      return response(res, true, StatusCodes.OK, 'Empréstimo criado com sucesso')
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

      return response(res, true, StatusCodes.OK, loan)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar o empréstimo.')
    }
  }

  static async getAllLoans (req, res) {
    try {
      const loans = await LoanRepository.getAllLoans()

      return response(res, true, StatusCodes.OK, loans)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar os empréstimos.')
    }
  }

  static async getAvailableLoans (req, res) {
    try {
      const loans = await LoanRepository.getAvailableLoans()

      return response(res, true, StatusCodes.OK, loans)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar os empréstimos disponíveis.')
    }
  }

  static async updateLoan (req, res) {
    const { id } = req.params
    const data = req.body

    console.log(data)

    try {
      const existingLoan = await LoanRepository.getLoanById(id)

      if (!existingLoan) {
        throw new HttpException('Empréstimo não encontrado.', StatusCodes.NOT_FOUND)
      }

      const updatedData = {
        title: data.title || existingLoan.Titulo,
        description: data.description || existingLoan.Descricao,
        value: data.value || existingLoan.Valor
      }

      await LoanRepository.updateSale(updatedData, id)

      return response(res, true, StatusCodes.OK, 'Empréstimo atualizado com sucesso.')
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao atualizar o empréstimo.')
    }
  }

  static async getUserLoans (req, res) {
    const id = req.user.Utilizador_ID

    try {
      const sales = await LoanRepository.getUserLoans(id)

      return response(res, true, StatusCodes.OK, sales)
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

      const stateId = await IdService.getStateById(status)

      if (!stateId) {
        throw new HttpException('Estado inválido.', StatusCodes.BAD_REQUEST)
      }

      await LoanRepository.updateLoanStatus(id, stateId)

      return response(res, true, StatusCodes.OK, 'Estado do empréstimoo atualizado.')
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao atualizar o estado do empréstimo.')
    }
  }
}

export default LoanController
