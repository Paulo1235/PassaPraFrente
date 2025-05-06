import express from 'express'

import AuthMiddleware from '../middlewares/auth-middleware.js'
import ProposalLoanController from '../controllers/proposal-loan-controller.js'
import { validateSchema } from '../utils/validate-schema.js'
import { proposalLoanSchema } from '../validations/proposal-loan-schema.js'
import OwnerMiddleware from '../middlewares/owner-middleware.js'

const proposalLoanRouter = express.Router()

proposalLoanRouter.get(
  '/proposal-loans/:id',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  ProposalLoanController.getLoanProposalById
)

proposalLoanRouter.put(
  '/proposal-loans/:id/user/:userId',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  OwnerMiddleware.isOwnerLoan,
  ProposalLoanController.updateProposalLoanStatus
)

proposalLoanRouter.get(
  '/proposal-loans',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.authorizedRoles(['admin']),
  ProposalLoanController.getAllLoanProposals
)
proposalLoanRouter.post(
  '/proposal-loans/create/:id',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.isAdult,
  validateSchema(proposalLoanSchema, false),
  ProposalLoanController.createProposalLoan
)
proposalLoanRouter.get(
  '/proposal-loans/user/user',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  ProposalLoanController.getLoanProposalsByUser
)
proposalLoanRouter.get(
  '/proposal-loans/loans/user',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  ProposalLoanController.getAllProposalEntriesByLoan
)

export default proposalLoanRouter
