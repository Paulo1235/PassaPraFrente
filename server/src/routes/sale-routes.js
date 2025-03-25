import express from 'express'

import { SaleController } from '../controllers/sale-controller.js'

import { saleSchema } from '../validations/sale-validation.js'
import { validateSchema } from '../utils/validate-schema.js'

export const saleRouter = express.Router()

saleRouter
  .route('/sales/id/:id')
  .get(SaleController.getSaleById)
  .put(validateSchema(saleSchema, true), SaleController.updateSale)

saleRouter.get('/sales', SaleController.getAllSales)
saleRouter.get('/sales/available', SaleController.getAvailableSales)
saleRouter.post('/sales/create', SaleController.createSale)
saleRouter.put('/sales/user', SaleController.getUserSales)
