import StatusCodes from 'http-status-codes'

import { UserRepository } from '../repositories/user-repository.js'
import { ErrorApplication } from '../utils/error-handler.js'
import { response } from '../utils/response.js'
import { hashPassword } from '../utils/bcrypt.js'

export class AuthController {
  static async createUser (req, res) {
    const { email, name, password } = req.body

    try {
      const hashedPassword = await hashPassword(password)

      const newUser = {
        email,
        name,
        password: hashedPassword
      }

      const user = await UserRepository.createUser(newUser)

      if (!user) {
        throw new ErrorApplication('User could not be created', StatusCodes.INTERNAL_SERVER_ERROR)
      }

      response(res, true, StatusCodes.CREATED, user)
    } catch (error) {
      if (error instanceof ErrorApplication) {
        response(res, false, error.statusCodes, error.message)
      } else {
        console.error('Internal error: ', error.message)
        response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while creating an user')
      }
    }
  }
}
