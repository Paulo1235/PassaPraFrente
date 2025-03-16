import express from 'express'

import { AuthController } from '../controllers/auth-controller.js'
import { validateSchema } from '../utils/validate-schema.js'
import { authSchema } from '../validations/auth-schema.js'
import { userSchema } from '../validations/user-validation.js'

export const authRouter = express.Router()

authRouter.post('/auth/register', validateSchema(authSchema, false), validateSchema(userSchema, false), AuthController.createUser)
authRouter.post('/auth/login', validateSchema(authSchema, true), AuthController.loginUser)
authRouter.post('/auth/logout', AuthController.logoutUser)
