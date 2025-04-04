import express from 'express'

import { LoanController } from '../controllers/loan-controller.js'
import { AuthMiddleware } from '../middlewares/auth-middleware.js'
import { loanSchema } from '../validations/loan-validation.js'
import { validateSchema } from '../utils/validate-schema.js'
import { ProposalMiddleware } from '../middlewares/proposal-middleware.js'

export const loanRouter = express.Router()

loanRouter
  .route('/loans/id/:id')
  .get(AuthMiddleware.isAuthenticated, LoanController.getLoanById)
  .put(
    validateSchema(loanSchema, true),
    AuthMiddleware.isAuthenticated,
    AuthMiddleware.isVerified,
    ProposalMiddleware.isOwnerLoan,
    LoanController.updateLoan)

loanRouter.get(
  '/loans',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.authorizedRoles(['admin']),
  LoanController.getAllLoans
)
loanRouter.get(
  '/loans/available',
  AuthMiddleware.isAuthenticated,
  LoanController.getAvailableLoans
)
loanRouter.post('/loans/create', AuthMiddleware.isAuthenticated, AuthMiddleware.isVerified, LoanController.createLoan)
loanRouter.put('/loans/user', AuthMiddleware.isAuthenticated, LoanController.getUserLoans)

loanRouter.patch(
  '/loans/update-status/:id',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.authorizedRoles(['admin']),
  LoanController.updateLoanStatus
)
