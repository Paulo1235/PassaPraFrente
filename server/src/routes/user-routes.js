import express from 'express'

import { UserController } from '../controllers/user-controller.js'
import { validateSchema } from '../utils/validate-schema.js'
import { userSchema } from '../validations/user-validation.js'
import { AuthMiddleware } from '../middlewares/auth-middleware.js'

export const userRouter = express.Router()

userRouter
  .route('/users/id/:id')
  .get(UserController.getUserById)
  .put(validateSchema(userSchema, true), UserController.updateUser)
  .delete(UserController.deleteUser)

userRouter.get('/users', AuthMiddleware.isAuthenticated, AuthMiddleware.isVerified, AuthMiddleware.authorizedRoles(['admin']), UserController.getAllUsers)

userRouter.get('/users/email/:email', AuthMiddleware.isAuthenticated, UserController.getUserByEmail)

userRouter.get('/users/me', AuthMiddleware.isAuthenticated, UserController.getUserInfo)

userRouter.patch('/users/update-password', AuthMiddleware.isAuthenticated, UserController.updateUserPassword)

userRouter.post('/users/send-email-password', UserController.sendNewPasswordEmail)
