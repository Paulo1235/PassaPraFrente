import express from 'express'

import AuthMiddleware from '../middlewares/auth-middleware.js'
import ProposalLoanController from '../controllers/proposal-loan-controller.js'
import AuthController from '../controllers/auth-controller.js'
import { validateSchema } from '../utils/validate-schema.js'
import { proposalLoanSchema } from '../validations/proposal-loan-schema.js'
import ProposalMiddleware from '../middlewares/owner-middleware.js'

const proposalLoanRouter = express.Router()

proposalLoanRouter.get(
  '/proposal-loans/:id',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  ProposalLoanController.getLoanProposalById
)

proposalLoanRouter.patch(
  '/proposal-loans/:id/user/:userId',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  ProposalMiddleware.isOwnerLoan,
  ProposalLoanController.updateProposalLoanStatus
)

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
proposalLoanRouter.get(
  '/proposal-loans/user/user',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.authorizedRoles(['admin']),
  ProposalLoanController.getLoanProposalsByUser
)
proposalLoanRouter.get(
  '/proposal-loans/loan/:id',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  ProposalMiddleware.isOwnerLoan,
  ProposalLoanController.getAllProposalEntriesByLoan
)

export default proposalLoanRouter
