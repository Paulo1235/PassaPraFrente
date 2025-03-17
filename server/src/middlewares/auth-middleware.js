import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'

import { response } from '../utils/response.js'
import { ACCESS_TOKEN_SECRET_KEY } from '../../config.js'
import { UserRepository } from '../repositories/user-repository.js'
import { ErrorApplication } from '../utils/error-handler.js'

export class AuthMiddleware {
  static async isAuthenticated (req, res, next) {
    const accessToken = req.cookies?.accessToken

    try {
      if (!accessToken) {
        throw new ErrorApplication('User not logged in', StatusCodes.UNAUTHORIZED)
      }

      const payload = jwt.verify(accessToken, ACCESS_TOKEN_SECRET_KEY)

      if (!payload) {
        throw new ErrorApplication('Unathorized access', StatusCodes.UNAUTHORIZED)
      }

      const user = await UserRepository.getUserById(payload.id)

      if (!user) {
        throw new ErrorApplication('User not found', StatusCodes.NOT_FOUND)
      }

      req.user = user
      next()
    } catch (error) {
      if (error instanceof ErrorApplication) {
        response(res, false, error.statusCodes, error.message)
      } else {
        console.error('Internal error: ', error.message)
        response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while authenticated the user')
      }
    }
  }
}
