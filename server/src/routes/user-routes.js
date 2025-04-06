import express from 'express'

import { validateSchema } from '../utils/validate-schema.js'
import { userSchema } from '../validations/user-validation.js'
import UserController from '../controllers/user-controller.js'
import AuthMiddleware from '../middlewares/auth-middleware.js'
import AuthController from '../controllers/auth-controller.js'

const userRouter = express.Router()

userRouter.get('/users/id/:id',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  UserController.getUserById
)

userRouter.put(
  '/users/update',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  validateSchema(userSchema, true),
  UserController.updateUser
)

userRouter.get(
  '/users',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.authorizedRoles(['admin']),
  UserController.getAllUsers
)

userRouter.get(
  '/users/email/:email',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.authorizedRoles(['admin']),
  UserController.getUserByEmail
)

userRouter.get(
  '/users/me',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  UserController.getUserInfo
)

userRouter.patch(
  '/users/update-password',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  UserController.updateUserPassword
)

userRouter.post(
  '/users/send-email-password',
  UserController.sendNewPasswordEmail
)

export default userRouter
