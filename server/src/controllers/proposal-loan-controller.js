import { StatusCodes } from 'http-status-codes'

import { handleError, HttpException } from '../utils/error-handler.js'
import response from '../utils/response.js'
import ProposalLoanRepository from '../repositories/proposal-loan-repository.js'
import LoanRepository from '../repositories/loan-repository.js'
import NotificationRepository from '../repositories/notification-repository.js'

class ProposalLoanController {
  static async createProposalLoan (req, res) {
    const data = req.body

    const newValue = data.newValue ?? 0

    const userId = req.user.Utilizador_ID
    const { id } = req.params

    try {
      const loan = await LoanRepository.getLoanById(id)

      const newStartDate = data.newStartDate ?? loan.DataInicio
      const newEndDate = data.newEndDate ?? loan.DataFim

      if (loan.Estado === 'Concluído' || loan.Estado === 'Cancelado' || loan.Estado === 'Em progresso') {
        throw new HttpException('Não é possível fazer uma proposta para esta venda.', StatusCodes.BAD_REQUEST)
      }

      if (loan.Utilizador_ID === userId) {
        throw new HttpException('Não é possível fazer uma proposta para a sua própria venda.', StatusCodes.BAD_REQUEST)
      }

      const proposal = await ProposalLoanRepository.getLoanProposalById(userId, id)

      if (proposal) {
        throw new HttpException('Já fez uma proposta para este empréstimo.', StatusCodes.BAD_REQUEST)
      }

      await ProposalLoanRepository.createProposalLoan(userId, id, newValue, newStartDate, newEndDate)

      return response(res, true, StatusCodes.CREATED, 'Proposta de empréstimo criada com sucesso.')
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao criar proposta.')
    }
  }

  static async getAllLoanProposals (req, res) {
    try {
      const proposals = await ProposalLoanRepository.getAllLoanProposals()

      return response(res, true, StatusCodes.OK, proposals)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar as propostas.')
    }
  }

  static async getLoanProposalById (req, res) {
    const { id } = req.params

    try {
      const proposal = await ProposalLoanRepository.getLoanProposalById(id)

      if (!proposal) {
        throw new HttpException('Proposta não encontrada.', StatusCodes.NOT_FOUND)
      }

      return response(res, true, StatusCodes.OK, proposal)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar a proposta.')
    }
  }

  static async updateProposalLoanStatus (req, res) {
    const { status } = req.body
    const { id, userId } = req.params

    try {
      const loan = await LoanRepository.getLoanById(id)

      if (!loan) {
        throw new HttpException('Não foi possível encontrar o empréstimo.', StatusCodes.NOT_FOUND)
      }

      NotificationRepository.createNotification(`A sua proposta para ${loan.Titulo} foi ${status} == 'Aceite' ? 'aceite' : 'recusada'`, userId)

      await ProposalLoanRepository.updateProposalLoanStatus(userId, id, status)

      return response(res, true, StatusCodes.OK, 'Estado da proposta atualizado.')
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao atualizar o estado da proposta.')
    }
  }
}

export default ProposalLoanController
