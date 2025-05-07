import express from 'express'

import { itemSchema } from '../validations/item-schema.js'
import { createLoanSchema, updateLoanSchema } from '../validations/loan-schema.js'
import { validateSchema } from '../utils/validate-schema.js'
import LoanController from '../controllers/loan-controller.js'
import AuthMiddleware from '../middlewares/auth-middleware.js'
import OwnerMiddleware from '../middlewares/owner-middleware.js'

const loanRouter = express.Router()

loanRouter.get(
  '/loans/id/:id',
  AuthMiddleware.isAuthenticated,
  LoanController.getLoanById
)

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
loanRouter.get(
  '/loans/pending',
  AuthMiddleware.isAuthenticated,
  LoanController.getPendingLoans
)
loanRouter.post(
  '/loans/create',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.isAdult,
  validateSchema(createLoanSchema, false),
  validateSchema(itemSchema, false),
  LoanController.createLoan
)
loanRouter.get(
  '/loans/user',
  AuthMiddleware.isAuthenticated,
  LoanController.getUserLoans,
  AuthMiddleware.isVerified
)

loanRouter.patch(
  '/loans/update-status/:id',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.authorizedRoles(['admin']),
  LoanController.updateLoanStatus
)

loanRouter.put(
  '/loans/update/:id',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  OwnerMiddleware.isOwnerLoan,
  validateSchema(updateLoanSchema, true),
  LoanController.updateLoan
)

loanRouter.get(
  '/loans/non-completed',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  LoanController.getNonCompletedLoansByUser
)

loanRouter.get(
  '/loans/completed',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  LoanController.getCompletedLoansByUser
)

export default loanRouter
