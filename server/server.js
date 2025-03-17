import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import StatusCodes from 'http-status-codes';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import colors from 'colors';
import swaggerUi from 'swagger-ui-express';

import { PORT, NODE_ENV, NAME, MAX, WINDOWMS } from './config.js';
import { readJSON } from './src/utils/file-helper.js';
import { userRouter } from './src/routes/user-routes.js';
import { response } from './src/utils/response.js';
import { checkDatabaseConnection } from './src/database/connection.js';
import { authRouter } from './src/routes/auth-routes.js';

const app = express();

const swaggerOutput = readJSON('docs/swagger-output.json');

// ✅ Fix: Correct CORS options
const corsOptions = {
  origin: 'http://localhost:3000', // ✅ No array, remove trailing slash
  methods: ['POST', 'GET', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// ✅ Apply CORS middleware FIRST before any other middleware
app.use(cors(corsOptions));

// ✅ Handle preflight requests properly
app.options('*', cors(corsOptions));

const limiter = rateLimit({
  max: MAX,
  windowMs: WINDOWMS,
  message: 'Too many requests from this IP. Try again later.',
});

colors.enable();

// Middlewares
NODE_ENV === 'development' ? app.use(morgan('dev')) : app.use(morgan('common'));

app.use(express.json());
app.use(cookieParser()); // ✅ Placed correctly
app.use(limiter);
app.use(helmet());
app.use(compression({ threshold: 1024 }));

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

app.use('/api', userRouter, authRouter);

app.get('/', (req, res) => {
  response(res, true, StatusCodes.OK, 'Hello World');
});

app.all('*', (req, res) => {
  response(res, false, StatusCodes.NOT_FOUND, `${req.method} ${req.originalUrl} not found!`);
});

app.listen(PORT, async () => {
  console.log(
    `\nApp '${NAME}' is running.`.bold.green + '\nActive in: ' + `http://localhost:${PORT}`.underline.blue
  );

  await checkDatabaseConnection();
});

export default app;
