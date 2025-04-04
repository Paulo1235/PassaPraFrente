import express from 'express'

import { TransactionSaleController } from '../controllers/transaction-sale-controller.js'
import { validateSchema } from '../utils/validate-schema.js'
import { transactionSaleSchema } from '../validations/transaction-sale.js'
import { AuthMiddleware } from '../middlewares/auth-middleware.js'

export const transactionSaleRouter = express.Router()

transactionSaleRouter.post(
  '/transaction-sale/create',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  validateSchema(transactionSaleSchema),
  TransactionSaleController.createTransactionSale
)

transactionSaleRouter.get(
  '/transaction-sale/get-all',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.authorizedRoles(['admin']),
  TransactionSaleController.getAllSaleTransactions
)

transactionSaleRouter.get(
  '/transaction-sale/getby:id',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  TransactionSaleController.getSaleTransactionById
)
