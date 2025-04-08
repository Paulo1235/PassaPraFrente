import express from 'express'

import AuthMiddleware from '../middlewares/auth-middleware.js'
import ProposalLoanController from '../controllers/proposal-loan-controller.js'
import AuthController from '../controllers/auth-controller.js'
import { validateSchema } from '../utils/validate-schema.js'
import { proposalLoanSchema } from '../validations/proposal-loan-validation.js'

const proposalLoanRouter = express.Router()

proposalLoanRouter
  .route('/proposal-loans/:id')
  .get(
    AuthController.refreshAccessToken,
    AuthMiddleware.isAuthenticated,
    AuthMiddleware.isVerified,
    ProposalLoanController.getLoanProposalById
  )
  .patch(
    AuthController.refreshAccessToken,
    AuthMiddleware.isAuthenticated,
    AuthMiddleware.isVerified,
    validateSchema(proposalLoanSchema, true),
    ProposalLoanController.updateProposalLoanStatus)

proposalLoanRouter.get(
  '/proposal-loans',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.authorizedRoles(['admin']),
  ProposalLoanController.getAllLoanProposals
)
proposalLoanRouter.post(
  '/proposal-loans/create/:id',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  validateSchema(proposalLoanSchema, false),
  ProposalLoanController.createProposalLoan
)

export default proposalLoanRouter
