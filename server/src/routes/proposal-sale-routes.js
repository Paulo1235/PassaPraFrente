import express from 'express'

import { AuthMiddleware } from '../middlewares/auth-middleware.js'
import { ProposalSaleController } from '../controllers/proposal-sale-controller.js'
import { ProposalMiddleware } from '../middlewares/proposal-middleware.js'

export const proposalSaleRouter = express.Router()

proposalSaleRouter
  .route('/proposal-sales/:id')
  .get(
    AuthMiddleware.isAuthenticated,
    AuthMiddleware.isVerified,
    ProposalSaleController.getSaleProposalById
  )
  .patch(
    AuthMiddleware.isAuthenticated,
    AuthMiddleware.isVerified, ProposalMiddleware.isOwnerSale,
    ProposalSaleController.updateProposalSaleStatus)

proposalSaleRouter.get(
  '/proposal-sales',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.authorizedRoles(['admin']),
  ProposalSaleController.getAllSaleProposals
)
proposalSaleRouter.post(
  '/proposal-sales/create',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  ProposalSaleController.createProposalSale)
