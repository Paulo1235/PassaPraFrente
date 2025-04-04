import express from 'express'

import { SaleController } from '../controllers/sale-controller.js'
import { AuthMiddleware } from '../middlewares/auth-middleware.js'
import { saleSchema } from '../validations/sale-validation.js'
import { validateSchema } from '../utils/validate-schema.js'
import { ProposalMiddleware } from '../middlewares/proposal-middleware.js'

export const saleRouter = express.Router()

saleRouter
  .route('/sales/id/:id')
  .get(AuthMiddleware.isAuthenticated, SaleController.getSaleById)
  .put(
    validateSchema(saleSchema, true),
    AuthMiddleware.isAuthenticated,
    AuthMiddleware.isVerified,
    ProposalMiddleware.isOwnerSale,
    SaleController.updateSale)

saleRouter.get(
  '/sales',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.authorizedRoles(['admin']),
  SaleController.getAllSales
)
saleRouter.get(
  '/sales/available',
  AuthMiddleware.isAuthenticated,
  SaleController.getAvailableSales
)
saleRouter.post('/sales/create', AuthMiddleware.isAuthenticated, AuthMiddleware.isVerified, SaleController.createSale)
saleRouter.put('/sales/user', AuthMiddleware.isAuthenticated, SaleController.getUserSales)

saleRouter.patch(
  '/sales/update-status/:id',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.authorizedRoles(['admin']),
  SaleController.updateSaleStatus
)
