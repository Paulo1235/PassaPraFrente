import express from 'express'

import SaleController from '../controllers/sale-controller.js'
import AuthMiddleware from '../middlewares/auth-middleware.js'
import { saleSchema } from '../validations/sale-schema.js'
import { validateSchema } from '../utils/validate-schema.js'
import ProposalMiddleware from '../middlewares/proposal-middleware.js'
import AuthController from '../controllers/auth-controller.js'
import { itemSchema } from '../validations/item-schema.js'

const saleRouter = express.Router()

saleRouter
  .route('/sales/id/:id')
  .get(AuthMiddleware.isAuthenticated, SaleController.getSaleById)
  .put(
    AuthController.refreshAccessToken,
    AuthMiddleware.isAuthenticated,
    AuthMiddleware.isVerified,
    ProposalMiddleware.isOwnerSale,
    validateSchema(saleSchema, true),
    SaleController.updateSale)

saleRouter.get(
  '/sales',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.authorizedRoles(['admin']),
  SaleController.getAllSales
)
saleRouter.get(
  '/sales/available',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  SaleController.getAvailableSales
)
saleRouter.post(
  '/sales/create',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  validateSchema(saleSchema, false),
  validateSchema(itemSchema, false),
  SaleController.createSale
)
saleRouter.get(
  '/sales/user',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  SaleController.getUserSales
)

saleRouter.patch(
  '/sales/update-status/:id',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  ProposalMiddleware.isOwnerSale,
  validateSchema(saleSchema, true),
  SaleController.updateSaleStatus
)

export default saleRouter
