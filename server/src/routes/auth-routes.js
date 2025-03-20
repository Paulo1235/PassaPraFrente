import express from 'express'

import { AuthController } from '../controllers/auth-controller.js'
import { validateSchema } from '../utils/validate-schema.js'
import { authSchema } from '../validations/auth-schema.js'
import { userSchema } from '../validations/user-validation.js'
import { AuthMiddleware } from '../middlewares/auth-middleware.js'

export const authRouter = express.Router()

authRouter.post('/auth/register', validateSchema(authSchema, false), validateSchema(userSchema, false), AuthController.createUser)
authRouter.post('/auth/login', validateSchema(authSchema, true), AuthController.loginUser)
authRouter.post('/auth/logout', AuthController.logoutUser)

authRouter.get('/auth/refresh-token', AuthController.refreshAccessToken)

authRouter.post('/auth/send-activation-email', AuthMiddleware.isAuthenticated, AuthController.sendAccountActivationEmail)
authRouter.post('/auth/activate-user', AuthMiddleware.isAuthenticated, AuthController.activateUser)
