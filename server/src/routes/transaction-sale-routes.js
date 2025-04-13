import express from 'express'

import AuthMiddleware from '../middlewares/auth-middleware.js'
import TransactionSaleController from '../controllers/transaction-sale-controller.js'
import AuthController from '../controllers/auth-controller.js'

const transactionSaleRouter = express.Router()

transactionSaleRouter.post(
  '/transactions-sales/create/:id',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  TransactionSaleController.createDirectTransactionSale
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
  '/transaction-sales/:id/user/:userId',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  TransactionSaleController.getSaleTransactionById
)

export default transactionSaleRouter
