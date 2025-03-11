import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import morgan from 'morgan'
import StatusCodes from 'http-status-codes'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import colors from 'colors'
import swaggerUi from 'swagger-ui-express'

import { PORT, NODE_ENV, NAME } from './config.js'
import { readJSON } from './utils/read-json.js'

const app = express()

const swaggerOutput = readJSON('docs/swagger-output.json')

const corsOptions = {
  // Define quais origens (domínios) podem acessar a API.
  origin: `http://localhost:${PORT}`,
  method: ['POST', 'GET', 'PUT', 'DELETE', 'PATCH']
}

const limiter = rateLimit({
  max: 50,
  windowMs: 10 * 60 * 1000,
  message: 'Too many requests from this IP. Try again later.'
})

colors.enable()

// Middlewares
NODE_ENV === 'development' ? app.use(morgan('dev')) : app.use(morgan('common'))

app.use(express.json())
app.use(cors(corsOptions))
app.use(limiter)
app.use(helmet())
app.use(cookieParser())
app.use(compression({ threshold: 1024 }))

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerOutput))

app.get('/', (req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Hello World'
  })
})

app.all('*', (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: `${req.method} ${req.originalUrl} not found!`
  })
})

app.listen(PORT, () => {
  console.log(`\nApp '${NAME}' is running.`
    .bold.green +
    '\nActive in: ' +
    `http://localhost:${PORT}`.underline.blue
  )
})

export default app
