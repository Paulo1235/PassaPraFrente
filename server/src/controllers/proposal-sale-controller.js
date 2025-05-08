import { StatusCodes } from 'http-status-codes'

import { handleError, HttpException } from '../utils/error-handler.js'
import response from '../utils/response.js'
import ProposalSaleRepository from '../repositories/proposal-sale-repository.js'
import SaleRepository from '../repositories/sale-repository.js'
import TransactionSaleController from './transaction-sale-controller.js'
import { PROPOSAL_SALE_STATES, SALE_STATES } from '../constants/status-constants.js'
import NotificationController from './notification-controller.js'
import TransactionSaleRepository from '../repositories/transaction-sale-repository.js'

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
        throw new HttpException('Venda não encontrada.', StatusCodes.NOT_FOUND)
      }

      if (sale.Estado === 'Concluído') {
        throw new HttpException('Venda já concluída.', StatusCodes.BAD_REQUEST)
      }

      const proposal = await ProposalSaleRepository.getSaleProposalById(userId, id)

      if (!proposal) {
        throw new HttpException('Proposta não encontrada', StatusCodes.NOT_FOUND)
      }

      await ProposalSaleRepository.updateProposalSaleStatus(userId, id, status)

      const notificationMessage = parseInt(status) === PROPOSAL_SALE_STATES.ACEITE
        ? `A sua proposta para ${sale.Titulo} foi aceite`
        : `A sua proposta para ${sale.Titulo} foi recusada`

      await NotificationController.createNotification({
        message: notificationMessage,
        read: 0,
        date: new Date(),
        category: 'Venda',
        userId: parseInt(userId)
      })

      if (parseInt(status) === PROPOSAL_SALE_STATES.ACEITE) {
        try {
          const existingTransaction = await TransactionSaleRepository.getSaleTransactionById(id, userId)

          if (!existingTransaction) {
            try {
              await TransactionSaleController.createTransactionSale(
                proposal.NovoValor,
                userId,
                id
              )

              await SaleRepository.updateSaleStatus(parseInt(id), SALE_STATES.CONCLUIDO)
            } catch (transactionError) {
              console.error('ERRO NA TRANSAÇÃO:', transactionError.message)

              // Reverte o status da proposta em caso de erro
              await ProposalSaleRepository.updateProposalSaleStatus(userId, id, PROPOSAL_SALE_STATES.DISPONIVEL)
            }
          }
        } catch (error) {
          console.error('Erro ao verificar/processar transação:', error)
        }
      }

      return response(res, true, StatusCodes.OK, 'Proposta atualizada')
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao atualizar a proposta. Tente novamente mais tarde.')
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

      const saleIds = sales.map(sale => sale.Venda_ID)

      for (const saleId of saleIds) {
        const proposal = await ProposalSaleRepository.getSaleProposalBySaleId(saleId)

        if (proposal) {
          proposals.push(proposal)
        }
      }

      return response(res, true, StatusCodes.OK, proposals)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar as vendas.')
    }
  }
}

export default ProposalSaleController
