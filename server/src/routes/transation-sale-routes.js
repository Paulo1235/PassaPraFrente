import express from 'express'

import { TrasactionSaleController } from '../controllers/transaction-sale-controller.js'
import { validateSchema } from '../utils/validate-schema.js'
import { transactionSaleSchema } from '../validations/transaction-sale-schema.js'

export const transactionSaleRouter = express.Router()

authRouter.post('/transaction-sale/create', TrasactionSaleController.createTransationSale)

authRouter.get('/transaction-sale/get-all', TrasactionSaleController.getAllTransationSales)
authRouter.get('/transaction-sale/getby:id', TrasactionSaleController.getSaleProposalById)

