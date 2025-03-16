import express from 'express'

import { UserController } from '../controllers/user-controller.js'
import { validateSchema } from '../utils/validate-schema.js'
import { userSchema } from '../validations/user-validation.js'
import { AuthMiddleware } from '../middlewares/auth-middleware.js'

export const userRouter = express.Router()

userRouter
  .route('/users/:id')
  .get(UserController.getUserById)
  .put(validateSchema(userSchema, true), UserController.updateUser)
  .delete(UserController.deleteUser)

userRouter
  .route('/users')
  .get(AuthMiddleware.isAuthenticated, UserController.getAllUsers)
