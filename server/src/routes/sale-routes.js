import express from 'express'

import { SaleController } from '../controllers/sale-controller.js'
import { AuthMiddleware } from '../middlewares/auth-middleware.js'
import { saleSchema } from '../validations/sale-validation.js'
import { validateSchema } from '../utils/validate-schema.js'

export const saleRouter = express.Router()

saleRouter
  .route('/sales/id/:id')
  .get(AuthMiddleware.isAuthenticated, SaleController.getSaleById)
  .put(validateSchema(saleSchema, true), SaleController.updateSale)

saleRouter.get('/sales', SaleController.getAllSales)
saleRouter.get('/sales/available', SaleController.getAvailableSales)
saleRouter.post('/sales/create', SaleController.createSale)
saleRouter.put('/sales/user', SaleController.getUserSales)

saleRouter.patch(
  '/sales/approve-sale',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.authorizedRoles(['admin']),
  SaleController.updateSaleStatus
)
