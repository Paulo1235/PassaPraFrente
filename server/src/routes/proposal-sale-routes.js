import express from 'express'

import AuthMiddleware from '../middlewares/auth-middleware.js'
import ProposalSaleController from '../controllers/proposal-sale-controller.js'
import AuthController from '../controllers/auth-controller.js'
import { validateSchema } from '../utils/validate-schema.js'
import { proposalSaleSchema } from '../validations/proposal-sale-schema.js'
import ProposalMiddleware from '../middlewares/owner-middleware.js'

const proposalSaleRouter = express.Router()

proposalSaleRouter.get(
  '/proposal-sales/:id',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  ProposalSaleController.getSaleProposalById
)

proposalSaleRouter.patch(
  'proposal-sales/:id/user/:userId',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  ProposalSaleController.updateProposalSaleStatus
)

proposalSaleRouter.get(
  '/proposal-sales',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.authorizedRoles(['admin']),
  ProposalSaleController.getAllSaleProposals
)
proposalSaleRouter.post(
  '/proposal-sales/create/:id',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  validateSchema(proposalSaleSchema, false),
  ProposalSaleController.createProposalSale
)
proposalSaleRouter.get(
  '/proposal-sales/user/user',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.authorizedRoles(['admin']),
  ProposalSaleController.getSaleProposalsByUser
)
proposalSaleRouter.get(
  '/proposal-sales/sale/:id',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  ProposalMiddleware.isOwnerSale,
  ProposalSaleController.getAllProposalEntriesBySale
)

export default proposalSaleRouter
