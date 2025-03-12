import express from 'express'

import { UserController } from '../controllers/user-controller.js'

export const userRouter = express.Router()

userRouter
  .route('/users/:id')
  .get(UserController.getUserById)
  .put(UserController.updateUser)
  .delete(UserController.deleteUser)

userRouter
  .route('/users')
  .get(UserController.getAllUsers)
  .post(UserController.createUser)
