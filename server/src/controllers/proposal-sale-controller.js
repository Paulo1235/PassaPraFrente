import { StatusCodes } from 'http-status-codes'

import { handleError, HttpException } from '../utils/error-handler.js'
import response from '../utils/response.js'
import ProposalSaleRepository from '../repositories/proposal-sale-repository.js'
import SaleRepository from '../repositories/sale-repository.js'
import TransactionSaleController from './transaction-sale-controller.js'
import { PROPOSAL_SALE_STATES } from '../constants/status-constants.js'
import NotificationController from './notification-controller.js'

class ProposalSaleController {
  static async createProposalSale (req, res) {
    const newValue = req.body.price

    const userId = req.user.Utilizador_ID
    const { id } = req.params

    try {
      const sale = await SaleRepository.getSaleById(id)

      if (!sale) {
        throw new HttpException('Venda não encontrada.', StatusCodes.NOT_FOUND)
      }

      // Manipular datas será melhor neste caso
      if (sale.Estado === 'Concluído' || sale.Estado === 'Em análise' || sale.Estado === 'Rejeitado') {
        throw new HttpException('Não é possível fazer uma proposta para esta venda.', StatusCodes.BAD_REQUEST)
      }

      if (sale.Utilizador_ID === userId) {
        throw new HttpException('Não é possível fazer uma proposta para a sua própria venda.', StatusCodes.BAD_REQUEST)
      }

      const proposal = await ProposalSaleRepository.getSaleProposalById(userId, id)

      if (proposal) {
        throw new HttpException('Já fez uma proposta para esta venda.', StatusCodes.BAD_REQUEST)
      }

      await ProposalSaleRepository.createProposalSale(newValue, userId, id, PROPOSAL_SALE_STATES.EM_ANALISE)

      return response(res, true, StatusCodes.CREATED, 'Proposta criada com sucesso.')
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
    const { userId, saleId } = req.params

    try {
      const proposal = await ProposalSaleRepository.getSaleProposalById(parseInt(userId), parseInt(saleId))

      if (!proposal) {
        throw new HttpException('Proposta não encontrada.', StatusCodes.NOT_FOUND)
      }

      return response(res, true, StatusCodes.OK, proposal)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar a proposta.')
    }
  }

  static async updateProposalSaleStatus (req, res) {
    const { status } = req.body
    const { id, userId } = req.params

    try {
      const sale = await SaleRepository.getSaleById(id)

      if (!sale) {
        throw new HttpException('Não foi possível encontrar a venda.', StatusCodes.NOT_FOUND)
      }

      if (sale.Estado === 'Concluído') {
        throw new HttpException('Esta venda já foi concluída. Não pode aceitar mais propostas.', StatusCodes.BAD_REQUEST)
      }

      const proposal = await ProposalSaleRepository.getSaleProposalById(userId, id)

      if (!proposal) {
        throw new HttpException('Não foi possível encontrar a proposta', StatusCodes.NOT_FOUND)
      }

      if (proposal.Aceite === PROPOSAL_SALE_STATES.ACEITE) {
        throw new HttpException('Esta proposta já foi aceite.', StatusCodes.BAD_REQUEST)
      }

      await ProposalSaleRepository.updateProposalSaleStatus(userId, id, status)

      const notificationData = {
        message: `A sua proposta para ${sale.Titulo} foi ${parseInt(status) === PROPOSAL_SALE_STATES.ACEITE ? 'aceite' : 'recusada'}`,
        category: 'Venda',
        userId
      }

      NotificationController.createNotification(notificationData)

      // Se a proposta for aceite, cria diretamente a transação
      if (parseInt(status) === PROPOSAL_SALE_STATES.ACEITE) {
        await TransactionSaleController.createTransactionSale(proposal.NovoValor, userId, id)
      }

      return response(res, true, StatusCodes.OK, 'Estado da proposta atualizado.')
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao atualizar o estado da proposta.')
    }
  }

  static async getSaleProposalsByUser (req, res) {
    const userId = req.user.Utilizador_ID

    try {
      const proposals = await ProposalSaleRepository.getSaleProposalsByUser(userId)

      return response(res, true, StatusCodes.OK, proposals)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar as propostas.')
    }
  }

  static async getAllProposalEntriesBySale (req, res) {
    const userId = req.user.Utilizador_ID
    const proposals = []

    try {
      const sales = await SaleRepository.getUserSales(userId)

      const saleIds = sales.map(sale => sale.Emprestimo_ID)

      for (const saleId of saleIds) {
        const proposal = await ProposalSaleRepository.getSaleProposalBySaleId(saleId)

        if (proposal) {
          proposals.push(proposal)
        }
      }

      return response(res, true, StatusCodes.OK, sales)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar as vendas.')
    }
  }
}

export default ProposalSaleController
