import StatusCodes from 'http-status-codes'

import { ErrorApplication } from '../utils/error-handler.js'
import { response } from '../utils/response.js'
import { LoanRepository } from '../repositories/loan-repository.js'
import { IdService } from '../services/id-service.js'

export class LoanController {
  static async createloan (req, res) {
    const userId = req.user.Utilizador_ID
    const data = req.body

    const fullData = {
      data,
      userId
    }

    console.log(fullData)

    try {
      await LoanRepository.createLoan(fullData)

      response(res, true, StatusCodes.OK, 'Empréstimo criado com sucesso')
    } catch (error) {
      console.error('Internal error: ', error.message)
      response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao criar o empréstimo.')
    }
  }

  static async getLoanById (req, res) {
    const { id } = req.params
    try {
      const loan = await LoanRepository.getLoanById(id)

      response(res, true, StatusCodes.OK, loan)
    } catch (error) {
      if (error instanceof ErrorApplication) {
        response(res, false, error.statusCodes, error.message)
      } else {
        console.error('Erro ao obter empréstimo: ', error.message)
        response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao encontrar um empréstimo.')
      }
    }
  }

  static async getAllLoans (req, res) {
    try {
      const loans = await LoanRepository.getAllLoans()

      response(res, true, StatusCodes.OK, loans)
    } catch (error) {
      console.error('Erro ao obter vendas: ', error.message)
      response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao encontrar os empréstimos.')
    }
  }

  static async getAvailableLoans (req, res) {
    try {
      const loans = await LoanRepository.getAvailableLoans()

      response(res, true, StatusCodes.OK, loans)
    } catch (error) {
      console.error('Erro ao obter empréstimos disponíveis: ', error.message)
      response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao obter os empréstimos disponíveis.')
    }
  }

  static async updateSale (req, res) {
    const { id } = req.params
    const data = req.body

    try {
      const existingLoan = await LoanRepository.getLoanById(id)

      if (!existingLoan) {
        throw new ErrorApplication('Empréstimo não encontrado.', StatusCodes.NOT_FOUND)
      }

      const updatedData = {
        title: data.title || existingLoan.Titulo,
        description: data.description || existingLoan.Descricao,
        value: data.value || existingLoan.Valor
      }

      await LoanRepository.updateSale(updatedData, id)

      response(res, true, StatusCodes.OK, 'Empréstimos atualizado com sucesso.')
    } catch (error) {
      if (error instanceof ErrorApplication) {
        response(res, false, error.statusCodes, error.message)
      } else {
        console.error('Erro ao atualizar o empréstimo: ', error.message)
        response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao atualizar o empréstimo.')
      }
    }
  }

  static async getUserLoans (req, res) {
    const id = req.user.Utilizador_ID
    try {
      const sales = await LoanRepository.getUserLoans(id)

      response(res, true, StatusCodes.OK, sales)
    } catch (error) {
      console.error('Erro ao obter empréstimos do utilizador:', error.message)
      response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro a obter os seus empréstimos. Tente novamente mais tarde.')
    }
  }

  static async updateLoanStatus (req, res) {
    const { status } = req.body
    const { id } = req.params

    try {
      const loan = await LoanRepository.getLoanById(id)

      if (!loan) {
        throw new ErrorApplication('Não foi possível encontrar o empréstimo.', StatusCodes.NOT_FOUND)
      }

      const stateId = await IdService.getStateById(status)
      if (!stateId) {
        throw new ErrorApplication('Estado inválido.', StatusCodes.BAD_REQUEST)
      }

      await LoanRepository.updateLoanStatus(id, stateId)

      response(res, true, StatusCodes.OK, 'Estado do empréstimoo atualizado.')
    } catch (error) {
      if (error instanceof ErrorApplication) {
        response(res, false, error.statusCodes, error.message)
      } else {
        console.error('Internal error: ', error.message)
        response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao atualizar o estado do empréstimo. Tente novamente mais tarde.')
      }
    }
  }
}
