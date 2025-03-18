import StatusCodes from 'http-status-codes'

import { UserRepository } from '../repositories/user-repository.js'
import { ErrorApplication } from '../utils/error-handler.js'
import { response } from '../utils/response.js'

export class UserController {
  static async getUserById (req, res) {
    const { id } = req.params

    try {
      const user = await UserRepository.getUserById(id)

      if (!user) {
        throw new ErrorApplication('User not found', StatusCodes.NOT_FOUND)
      }

      response(res, true, StatusCodes.OK, user)
    } catch (error) {
      if (error instanceof ErrorApplication) {
        response(res, false, error.statusCodes, error.message)
      } else {
        console.error('Internal error: ', error.message)
        response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while finding an user')
      }
    }
  }

  static async getAllUsers (req, res) {
    try {
      const users = await UserRepository.getAllUsers()
      response(res, true, StatusCodes.OK, users)
    } catch (error) {
      console.error('Internal error: ', error.message)
      response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while finding all users')
    }
  }

  static async deleteUser (req, res) {
    const { id } = req.params

    try {
      const result = await UserRepository.deleteUser(id)

      if (!result) {
        throw new ErrorApplication('User not found', StatusCodes.NOT_FOUND)
      }

      response(res, true, StatusCodes.OK, 'User deleted')
    } catch (error) {
      if (error instanceof ErrorApplication) {
        response(res, false, error.statusCodes, error.message)
      } else {
        console.error('Internal error: ', error.message)
        response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while deleting an user')
      }
    }
  }

  static async updateUser (req, res) {
    const data = req.body
    const { id } = req.params

    try {
      const result = await UserRepository.updateUser({ id, data })

      if (!result) {
        throw new ErrorApplication('User could not be found', StatusCodes.NOT_FOUND)
      }

      response(res, true, StatusCodes.OK, 'User updated')
    } catch (error) {
      if (error instanceof ErrorApplication) {
        response(res, false, error.statusCodes, error.message)
      } else {
        console.error('Internal error: ', error.message)
        response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while creating an user')
      }
    }
  }

  static async getUserByEmail (req, res) {
    const { email } = req.params

    try {
      const user = await UserRepository.getUserByEmail(email)

      if (!user) {
        throw new ErrorApplication('User not found', StatusCodes.NOT_FOUND)
      }

      response(res, true, StatusCodes.OK, user)
    } catch (error) {
      if (error instanceof ErrorApplication) {
        response(res, false, error.statusCodes, error.message)
      } else {
        console.error('Erro ao obter utilizador por email: ', error.message)
        response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Um erro ocorreu ao encontrar um utilizador.')
      }
    }
  }

  static async getUserInfo (req, res) {
    const id = req.user.Utilizador_ID

    try {
      const user = await UserRepository.getUserById(id)

      response(res, true, StatusCodes.OK, user)
    } catch (error) {
      console.error('Erro ao obter utilizador: ', error.message)
      response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao obter o utilizador.')
    }
  }
}
