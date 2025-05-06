import express from 'express'

import AuthMiddleware from '../middlewares/auth-middleware.js'
import ProposalSaleController from '../controllers/proposal-sale-controller.js'
import { validateSchema } from '../utils/validate-schema.js'
import { proposalSaleSchema } from '../validations/proposal-sale-schema.js'

const proposalSaleRouter = express.Router()

proposalSaleRouter.get(
  '/proposal-sales/:id',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  ProposalSaleController.getSaleProposalById
)

proposalSaleRouter.put(
  '/proposal-sales/:id/user/:userId',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  ProposalSaleController.updateProposalSaleStatus
)

proposalSaleRouter.get(
  '/proposal-sales',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.authorizedRoles(['admin']),
  ProposalSaleController.getAllSaleProposals
)
proposalSaleRouter.post(
  '/proposal-sales/create/:id',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.isAdult,
  validateSchema(proposalSaleSchema, false),
  ProposalSaleController.createProposalSale
)
proposalSaleRouter.get(
  '/proposal-sales/user/user',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  ProposalSaleController.getSaleProposalsByUser
)
proposalSaleRouter.get(
  '/proposal-sales/sales/user',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  ProposalSaleController.getAllProposalEntriesBySale
)

export default proposalSaleRouter
