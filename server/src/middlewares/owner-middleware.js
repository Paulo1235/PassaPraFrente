import { StatusCodes } from 'http-status-codes'

import { handleError, HttpException } from '../utils/error-handler.js'
import SaleRepository from '../repositories/sale-repository.js'
import LoanRepository from '../repositories/loan-repository.js'
import GiveawayRepository from '../repositories/giveaway-repository.js'

class ProposalMiddleware {
  static async isOwnerSale (req, res, next) {
    const userId = req.user.Utilizador_ID
    const { id } = req.params

    try {
      const sale = await SaleRepository.getSaleById(id)

      const ownerId = sale.Utilizador_ID

      if (userId !== ownerId) {
        throw new HttpException('Não é o dono desta venda!', StatusCodes.UNAUTHORIZED)
      }

      next()
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao verificar se é o dono da venda.')
    }
  }

  static async isOwnerLoan (req, res, next) {
    const userId = req.user.Utilizador_ID
    const { id } = req.params

    try {
      const loan = await LoanRepository.getLoanById(id)

      if (!loan) {
        throw new HttpException('Empréstimo não encontrado', StatusCodes.NOT_FOUND)
      }

      const ownerId = loan.Utilizador_ID

      if (userId !== ownerId) {
        throw new HttpException('Não é o dono deste empréstimo!', StatusCodes.UNAUTHORIZED)
      }

      next()
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao verificar se é o dono do empréstimo.')
    }
  }

  static async isOwnerGiveaway (req, res, next) {
    const userId = req.user.Utilizador_ID
    const { id } = req.params

    try {
      const giveaway = await GiveawayRepository.getGiveawayById(id)

      const ownerId = giveaway.Utilizador_ID

      if (userId !== ownerId) {
        throw new HttpException('Não é o dono deste giveaway!', StatusCodes.UNAUTHORIZED)
      }

      next()
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao verificar se é o dono do giveaway.')
    }
  }
}

export default ProposalMiddleware
