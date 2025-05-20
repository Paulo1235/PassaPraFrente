import express from 'express'

import AuthMiddleware from '../middlewares/auth-middleware.js'
import TransactionSaleController from '../controllers/transaction-sale-controller.js'
import { validateSchema } from '../utils/validate-schema.js'
import { reviewSchema } from '../validations/review-schema.js'

const transactionSaleRouter = express.Router()

transactionSaleRouter.post(
  '/transactions-sales/create/:id',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.isAdult,
  TransactionSaleController.createDirectTransactionSale
)

transactionSaleRouter.get(
  '/transaction-sales',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.authorizedRoles(['admin']),
  TransactionSaleController.getAllSaleTransactions
)

transactionSaleRouter.get(
  '/transaction-sales/:id/user/:userId',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  TransactionSaleController.getSaleTransactionById
)

transactionSaleRouter.patch(
  '/transaction-sales/review/:id',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  validateSchema(reviewSchema, false),
  TransactionSaleController.createReviewTransactionSale
)

transactionSaleRouter.get(
  '/transaction-sales/user',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  TransactionSaleController.getSaleTransactionByUserId
)

export default transactionSaleRouter
