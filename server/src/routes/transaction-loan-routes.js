import express from 'express'

import AuthMiddleware from '../middlewares/auth-middleware.js'
import TransactionLoanController from '../controllers/transaction-loan-controller.js'
import AuthController from '../controllers/auth-controller.js'

const transactionLoanRouter = express.Router()

transactionLoanRouter.post(
  '/transactions-loans/create',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
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

export default transactionLoanRouter
