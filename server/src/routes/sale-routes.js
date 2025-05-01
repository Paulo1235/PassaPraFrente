import express from 'express'

import SaleController from '../controllers/sale-controller.js'
import AuthMiddleware from '../middlewares/auth-middleware.js'
import { saleSchema } from '../validations/sale-schema.js'
import { validateSchema } from '../utils/validate-schema.js'
import OwnerMiddleware from '../middlewares/owner-middleware.js'
import { itemSchema } from '../validations/item-schema.js'

const saleRouter = express.Router()

saleRouter
  .route('/sales/id/:id')
  .get(AuthMiddleware.isAuthenticated, SaleController.getSaleById)
  .put(
    AuthMiddleware.isAuthenticated,
    AuthMiddleware.isVerified,
    OwnerMiddleware.isOwnerSale,
    validateSchema(saleSchema, true),
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
saleRouter.get(
  '/sales/pending',
  AuthMiddleware.isAuthenticated,
  SaleController.getPendingSales
)
saleRouter.post(
  '/sales/create',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.isAdult,
  validateSchema(saleSchema, false),
  validateSchema(itemSchema, false),
  SaleController.createSale
)
saleRouter.get(
  '/sales/user',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  SaleController.getUserSales
)

saleRouter.patch(
  '/sales/update-status/:id',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.authorizedRoles(['admin']),
  SaleController.updateSaleStatus
)

saleRouter.get(
  '/sales/non-completed',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  SaleController.getNonCompletedSalesByUser
)

saleRouter.get(
  '/sales/completed',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  SaleController.getCompletedSalesByUser
)

export default saleRouter
