import { StatusCodes } from 'http-status-codes'

import { SaleRepository } from '../repositories/sale-repository.js'
import { ErrorApplication } from '../utils/error-handler.js'
import { response } from '../utils/response.js'

export class ProposalMiddleware {
  static async isOwnerSale (req, res, next) {
    const userId = req.user.Utilizador_ID
    const { id } = req.params

    try {
      const sale = await SaleRepository.getSaleById(id)

      const ownerId = sale.Utilizador_ID

      if (userId !== ownerId) {
        throw new ErrorApplication('Não é o dono desta venda!', StatusCodes.UNAUTHORIZED)
      }

      next()
    } catch (error) {
      if (error instanceof ErrorApplication) {
        response(res, false, error.statusCodes, error.message)
      } else {
        console.error('Internal error: ', error.message)
        response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao verificar se é o dono da venda. Tente fazer login novamente.')
      }
    }
  }
}
