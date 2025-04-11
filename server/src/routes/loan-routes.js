import express from 'express'

import { itemSchema } from '../validations/item-schema.js'
import { loanSchema } from '../validations/loan-schema.js'
import { validateSchema } from '../utils/validate-schema.js'
import LoanController from '../controllers/loan-controller.js'
import AuthMiddleware from '../middlewares/auth-middleware.js'
import ProposalMiddleware from '../middlewares/proposal-middleware.js'
import AuthController from '../controllers/auth-controller.js'

const loanRouter = express.Router()

loanRouter
  .route('/loans/id/:id')
  .get(AuthMiddleware.isAuthenticated, LoanController.getLoanById)
  .put(
    AuthController.refreshAccessToken,
    AuthMiddleware.isAuthenticated,
    AuthMiddleware.isVerified,
    ProposalMiddleware.isOwnerLoan,
    validateSchema(loanSchema, true), 
    validateSchema(itemSchema, true),
    LoanController.updateLoan
  )

loanRouter.get(
  '/loans',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.authorizedRoles(['admin']),
  LoanController.getAllLoans
)
loanRouter.get(
  '/loans/available',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  LoanController.getAvailableLoans
)
loanRouter.post(
  '/loans/create',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  validateSchema(loanSchema, false),
  LoanController.createLoan
)
loanRouter.get(
  '/loans/user',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  LoanController.getUserLoans,
  AuthMiddleware.isVerified
)

loanRouter.patch(
  '/loans/update-status/:id',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  ProposalMiddleware.isOwnerLoan,
  validateSchema(loanSchema, true),
  LoanController.updateLoanStatus
)

loanRouter.put(
  '/loans/update/:id',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  ProposalMiddleware.isOwnerLoan,
  validateSchema(loanSchema, true),
  LoanController.updateLoan
)

export default loanRouter
