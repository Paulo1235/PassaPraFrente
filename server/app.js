import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import swaggerUi from 'swagger-ui-express'
import StatusCodes from 'http-status-codes'

import { NODE_ENV, MAX, WINDOWMS } from './config.js'

import response from './src/utils/response.js'
import AuthMiddleware from './src/middlewares/auth-middleware.js'
import FileService from './src/services/file-service.js'

import userRouter from './src/routes/user-routes.js'
import authRouter from './src/routes/auth-routes.js'
import saleRouter from './src/routes/sale-routes.js'
import proposalSaleRouter from './src/routes/proposal-sale-routes.js'
import proposalLoanRouter from './src/routes/proposal-loan-routes.js'
import transactionSaleRouter from './src/routes/transaction-sale-routes.js'
import transactionLoanRouter from './src/routes/transaction-loan-routes.js'
import loanRouter from './src/routes/loan-routes.js'
import giveawayRouter from './src/routes/giveaway-routes.js'
import entryGiveawayRouter from './src/routes/entry-giveaway-routes.js'
import winnerGiveawayRouter from './src/routes/winner-giveaway-routes.js'
import notificationRouter from './src/routes/notification-routes.js'

const app = express()

const corsOptions = {
  origin: ['http://localhost:3000'],
  methods: ['POST', 'GET', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}

const limiter = rateLimit({
  max: MAX,
  windowMs: WINDOWMS,
  message: 'Demasiados pedidos, tente novamente mais tarde!'
})

// Middlewares
NODE_ENV === 'development' ? app.use(morgan('dev')) : app.use(morgan('common'))

app.use(cors(corsOptions))
app.options('*', cors(corsOptions))
app.use(cookieParser())
app.use(limiter)
app.use(helmet())
app.use(compression())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Swagger
const swaggerOutput = FileService.readJSON('docs/swagger-output.json')

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerOutput))

app.use(
  '/api',
  userRouter,
  authRouter,
  proposalSaleRouter,
  saleRouter,
  transactionSaleRouter,
  loanRouter,
  giveawayRouter,
  notificationRouter,
  entryGiveawayRouter,
  winnerGiveawayRouter,
  proposalLoanRouter,
  transactionLoanRouter
)

app.get('/', (req, res) => {
  return response(res, true, StatusCodes.OK, 'Hello World')
})

app.get('/api/protected-route', AuthMiddleware.isAuthenticated, (req, res) => {
  return response(res, true, StatusCodes.OK, 'Protected route reached')
})

app.get('*', (req, res) => {
  return response(res, false, StatusCodes.NOT_FOUND, `Rota ${req.method} ${req.originalUrl} não encontrada!`)
})

export default app
