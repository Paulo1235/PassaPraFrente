import express from 'express'

import { validateSchema } from '../utils/validate-schema.js'
import { transactionSaleSchema } from '../validations/transaction-sale-schema.js'
import AuthMiddleware from '../middlewares/auth-middleware.js'
import TransactionSaleController from '../controllers/transaction-sale-controller.js'
import AuthController from '../controllers/auth-controller.js'

const transactionSaleRouter = express.Router()

transactionSaleRouter.post(
  '/transaction-sales/create',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  validateSchema(transactionSaleSchema, false),
  TransactionSaleController.createTransactionSale
)

transactionSaleRouter.get(
  '/transaction-sales',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.authorizedRoles(['admin']),
  TransactionSaleController.getAllSaleTransactions
)

transactionSaleRouter.get(
  '/transaction-sales/:id',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  TransactionSaleController.getSaleTransactionById
)

export default transactionSaleRouter
