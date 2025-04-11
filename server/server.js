import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import morgan from 'morgan'
import StatusCodes from 'http-status-codes'
import compression from 'compression'
import chalk from 'chalk'
import swaggerUi from 'swagger-ui-express'
import cookieParser from 'cookie-parser'

import { PORT, NODE_ENV, NAME, MAX, WINDOWMS } from './config.js'

import response from './src/utils/response.js'
import { checkDatabaseConnection } from './src/database/connection.js'

import AuthMiddleware from './src/middlewares/auth-middleware.js'
import FileService from './src/services/file-service.js'

import userRouter from './src/routes/user-routes.js'
import authRouter from './src/routes/auth-routes.js'
import saleRouter from './src/routes/sale-routes.js'
import proposalSaleRouter from './src/routes/proposal-sale-routes.js'
import transactionSaleRouter from './src/routes/transaction-sale-routes.js'
import loanRouter from './src/routes/loan-routes.js'
import giveawayRouter from './src/routes/giveaway-routes.js'
import entryGiveawayRouter from './src/routes/entry-giveaway-routes.js'
import winnerGiveawayRouter from './src/routes/winner-giveaway-routes.js'
import notificationRouter from './src/routes/notification-routes.js'

import { initSocketServer } from './src/utils/socket-server.js'
import { getConnection } from './src/database/db-config.js'
import { configureCloudinary } from './src/services/cloudinary-service.js'

const app = express()

const swaggerOutput = FileService.readJSON('docs/swagger-output.json')

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

configureCloudinary()

// Middlewares
NODE_ENV === 'development' ? app.use(morgan('dev')) : app.use(morgan('common'))

app.use(cors(corsOptions))
app.options('*', cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use(limiter)
app.use(helmet())
app.use(compression())

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerOutput))

app.use('/api',
  userRouter,
  authRouter,
  proposalSaleRouter,
  saleRouter,
  transactionSaleRouter,
  loanRouter,
  giveawayRouter,
  notificationRouter,
  entryGiveawayRouter,
  winnerGiveawayRouter
)

app.get('/', (req, res) => {
  return response(res, true, StatusCodes.OK, 'Hello World')
})

//* colocar um protectedroute rota
app.get('/api/protected-route', AuthMiddleware.isAuthenticated, (req, res) => {
  return response(res, true, StatusCodes.OK, 'Protected route reached')
})

app.get('*', (req, res) => {
  return response(res, false, StatusCodes.NOT_FOUND, `Rota ${req.method} ${req.originalUrl} não encontrada!`)
})

initSocketServer(app)

if (NODE_ENV !== 'test') {
  app.listen(PORT, async () => {
    console.log(
      chalk.green.bold(`\nApp '${NAME}' está a correr.`) + '\n' + chalk.blue.underline(`Ativo em: http://localhost:${PORT}`)
    )
    await checkDatabaseConnection()
  })
}

process.on('SIGINT', async () => {
  const pool = await getConnection()

  await pool.close()

  process.exit(0)
})

process.on('SIGTERM', async () => {
  const pool = await getConnection()

  await pool.close()

  process.exit(0)
})

export default app
