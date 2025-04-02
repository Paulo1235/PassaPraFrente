import StatusCodes from 'http-status-codes'

import { ErrorApplication } from '../utils/error-handler.js'
import { response } from '../utils/response.js'
import { ProposalRepository } from '../repositories/proposal-repository.js'

export class ProposalSaleController {
  static async createProposalSale (req, res) {
    const data = req.body
    try {
      const proposal = await ProposalRepository.createSale(data)

      if (!proposal) {
        throw new ErrorApplication('Não foi possível criar a proposta.', StatusCodes.BAD_REQUEST)
      }

      response(res, true, StatusCodes.OK, proposal)
    } catch (error) {
      if (error instanceof ErrorApplication) {
        response(res, false, error.statusCodes, error.message)
      } else {
        console.error('Internal error: ', error.message)
        response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao criar proposta.')
      }
    }
  }

  static async getAllSaleProposals (req, res) {
    try {
      const proposals = await ProposalRepository.getAllSaleProposals()

      response(res, true, StatusCodes.OK, proposals)
    } catch (error) {
      if (error instanceof ErrorApplication) {
        response(res, false, error.statusCodes, error.message)
      } else {
        console.error('Erro ao obter propostas: ', error.message)
        response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao encontrar propostas.')
      }
    }
  }

  static async getSaleProposalById (req, res) {
    const { id } = req.params
    try {
      const proposal = await ProposalRepository.getSaleProposalById(id)

      if (!proposal) {
        throw new ErrorApplication('Proposta não encontrada.', StatusCodes.NOT_FOUND)
      }

      response(res, true, StatusCodes.OK, proposal)
    } catch (error) {
      if (error instanceof ErrorApplication) {
        response(res, false, error.statusCodes, error.message)
      } else {
        console.error('Erro ao obter proposta: ', error.message)
        response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao encontrar uma proposta.')
      }
    }
  }
}
