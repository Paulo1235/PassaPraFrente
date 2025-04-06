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
import { v2 as cloudinary } from 'cloudinary'

import { PORT, NODE_ENV, NAME, MAX, WINDOWMS, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_NAME } from './config.js'

import response from './src/utils/response.js'
import { checkDatabaseConnection } from './src/database/connection.js'

import AuthMiddleware from './src/middlewares/auth-middleware.js'
import FileService from './src/services/file-service.js'

import userRouter from './src/routes/user-routes.js'
import authRouter from './src/routes/auth-routes.js'
import saleRouter from './src/routes/sale-routes.js'
import proposalSaleRouter from './src/routes/proposal-sale-routes.js'
import transactionSaleRouter from './src/routes/transation-sale-routes.js'

import { initSocketServer } from './src/utils/socket-server.js'

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

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
})

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

app.use('/api', userRouter, authRouter, proposalSaleRouter, saleRouter, transactionSaleRouter)

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

if (NODE_ENV !== 'testing') {
  app.listen(PORT, async () => {
    console.log(
      chalk.green.bold(`\nApp '${NAME}' está a correr.`) + '\n' + chalk.blue.underline(`Ativo em: http://localhost:${PORT}`)
    )
    await checkDatabaseConnection()
  })
}

export default app
