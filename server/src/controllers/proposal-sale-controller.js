import { StatusCodes } from 'http-status-codes'

import { handleError, HttpException } from '../utils/error-handler.js'
import response from '../utils/response.js'
import ProposalSaleRepository from '../repositories/proposal-sale-repository.js'
import SaleRepository from '../repositories/sale-repository.js'

class ProposalSaleController {
  static async createProposalSale (req, res) {
    const data = req.body

    try {
      const proposal = await ProposalSaleRepository.createSale(data)

      if (!proposal) {
        throw new HttpException('Não foi possível criar a proposta.', StatusCodes.BAD_REQUEST)
      }

      return response(res, true, StatusCodes.OK, proposal)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao criar proposta.')
    }
  }

  static async getAllSaleProposals (req, res) {
    try {
      const proposals = await ProposalSaleRepository.getAllSaleProposals()

      return response(res, true, StatusCodes.OK, proposals)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar as propostas.')
    }
  }

  static async getSaleProposalById (req, res) {
    const { id } = req.params

    try {
      const proposal = await ProposalSaleRepository.getSaleProposalById(id)

      if (!proposal) {
        throw new HttpException('Proposta não encontrada.', StatusCodes.NOT_FOUND)
      }

      return response(res, true, StatusCodes.OK, proposal)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar a proposta.')
    }
  }

  static async updateProposalSaleStatus (req, res) {
    const userId = req.user.Utilizador_ID
    const { status } = req.body
    const { id } = req.params

    try {
      const sale = await SaleRepository.getSaleById(id)

      if (!sale) {
        throw new HttpException('Não foi possível encontrar a venda.', StatusCodes.NOT_FOUND)
      }

      await ProposalSaleRepository.updateProposalSaleStatus(userId, id, status)

      return response(res, true, StatusCodes.OK, 'Estado da proposta atualizado.')
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao atualizar o estado da proposta.')
    }
  }
}

export default ProposalSaleController
