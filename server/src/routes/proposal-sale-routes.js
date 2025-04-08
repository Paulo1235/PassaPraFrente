import express from 'express'

import AuthMiddleware from '../middlewares/auth-middleware.js'
import ProposalSaleController from '../controllers/proposal-sale-controller.js'
import AuthController from '../controllers/auth-controller.js'
import { validateSchema } from '../utils/validate-schema.js'
import { proposalSaleSchema } from '../validations/proposal-sale-validation.js'

const proposalSaleRouter = express.Router()

proposalSaleRouter
  .route('/proposal-sales/:id')
  .get(
    AuthController.refreshAccessToken,
    AuthMiddleware.isAuthenticated,
    AuthMiddleware.isVerified,
    ProposalSaleController.getSaleProposalById
  )
  .patch(
    AuthController.refreshAccessToken,
    AuthMiddleware.isAuthenticated,
    AuthMiddleware.isVerified,
    validateSchema(proposalSaleSchema, true),
    ProposalSaleController.updateProposalSaleStatus)

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

export default proposalSaleRouter
