import express from 'express'

import AuthMiddleware from '../middlewares/auth-middleware.js'
import TransactionLoanController from '../controllers/transaction-loan-controller.js'
import AuthController from '../controllers/auth-controller.js'
import { reviewSchema } from '../validations/review-schema.js'
import { validateSchema } from '../utils/validate-schema.js'

const transactionLoanRouter = express.Router()

transactionLoanRouter.post(
  '/transactions-loans/create/:id',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.isAdult,
  TransactionLoanController.createDirectTransactionLoan
)

transactionLoanRouter.get(
  '/transaction-loans',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.authorizedRoles(['admin']),
  TransactionLoanController.getAllLoanTransactions
)

transactionLoanRouter.get(
  '/transaction-loans/:id',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  TransactionLoanController.getLoanTransactionById
)

transactionLoanRouter.patch(
  '/transaction-loans/review/:id',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  validateSchema(reviewSchema, false),
  TransactionLoanController.createReviewTransactionLoan
)

export default transactionLoanRouter
