import StatusCodes from 'http-status-codes'

import { UserRepository } from '../repositories/user-repository.js'
import { ErrorApplication } from '../utils/error-handler.js'
import { response } from '../utils/response.js'
import { hashPassword } from '../utils/password.js'
import { PasswordService } from '../services/password-service.js'
import { EmailService } from '../services/email-service.js'

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

  static async updateUserPassword (req, res) {
    const id = req.user.Utilizador_ID
    const { newPassword, confirmPassword } = req.body

    if (newPassword !== confirmPassword) {
      response(res, false, StatusCodes.BAD_REQUEST, 'Palavra-passe incorreta!')
    }

    try {
      const hashedPassword = await hashPassword(newPassword)

      await UserRepository.updateUserPassword(id, hashedPassword)

      response(res, true, StatusCodes.OK, 'Palavra-passe atualizada com sucesso.')
    } catch (error) {
      console.error('Erro ao atualizar a palavra-passe: ', error.message)
      response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao atualizar a palavra-passe')
    }
  }

  static async sendNewPasswordEmail (req, res) {
    const { email } = req.body

    try {
      const user = await UserRepository.getUserByEmail(email)

      const newPassword = await PasswordService.generateAndStoreNewPassword(user.Utilizador_ID)

      const emailData = { user, newPassword }

      await EmailService.prepareEmailContent('new-password.ejs', emailData)

      await EmailService.sendEmail({
        email: user.Email,
        subject: 'Nova palavra-passe',
        template: 'new-password.ejs',
        emailData
      })

      response(res, true, StatusCodes.OK, 'Verifique o seu email para verificar a sua nova palavra-passe.')
    } catch (error) {
      console.error('Erro ao enviar o email:', error.message)
      response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao enviar o email para a sua conta.')
    }
  }
}
