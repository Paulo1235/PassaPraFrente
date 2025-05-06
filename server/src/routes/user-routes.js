import express from 'express'

import { validateSchema } from '../utils/validate-schema.js'
import { userSchema } from '../validations/user-schema.js'
import UserController from '../controllers/user-controller.js'
import AuthMiddleware from '../middlewares/auth-middleware.js'
import { imageSchema } from '../validations/image-schema.js'

const userRouter = express.Router()

userRouter.get('/users/id/:id',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  UserController.getUserById
)

userRouter.put(
  '/users/update',
  AuthMiddleware.isAuthenticated,
  // AuthMiddleware.isVerified,
  validateSchema(userSchema, true),
  UserController.updateUser
)

userRouter.get(
  '/users',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.authorizedRoles(['admin']),
  UserController.getAllUsers
)

userRouter.get(
  '/users/email/:email',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.authorizedRoles(['admin']),
  UserController.getUserByEmail
)

userRouter.get(
  '/users/me',
  AuthMiddleware.isAuthenticated,
  UserController.getUserInfo
)

userRouter.patch(
  '/users/update-password',
  AuthMiddleware.isAuthenticated,
  UserController.updateUserPassword
)

userRouter.post(
  '/users/send-email-password',
  UserController.sendNewPasswordEmail
)

userRouter.patch(
  '/users/update-avatar',
  AuthMiddleware.isAuthenticated,
  validateSchema(imageSchema, false),
  UserController.saveUserAvatar
)

userRouter.get(
  '/users/my-reviews',
  AuthMiddleware.isAuthenticated,
  UserController.getReviewRateUser
)

export default userRouter
