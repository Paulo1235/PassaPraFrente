import StatusCodes from 'http-status-codes'
import cloudinary from 'cloudinary'

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

  static async uploadUserAvatar (req, res) {
    const id = req.user.Utilizador_ID
    const { thumbnail } = req.body

    try {
      const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
        folder: 'users'
      })

      const updateSuccess = await UserRepository.uploadUserAvatar(id, myCloud.public_id, myCloud.url)

      if (updateSuccess) {
        response(res, true, StatusCodes.OK, 'Imagem inserida.')
      }

      response(res, false, StatusCodes.BAD_REQUEST, 'Ocorreu um erro ao inserir a imagem.')
    } catch (error) {
      console.error('Erro ao inserir imagem:', error.message)
      response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao inserir a sua imagem. Tente mais tarde.')
    }
  }

  static async updateUserAvatar (req, res) {
    const id = req.user.Utilizador_ID
    const { avatar } = req.body

    try {
      const userAvatar = await UserRepository.getUserAvatar(id)

      if (userAvatar.public_id) {
        await cloudinary.v2.uploader.destroy(userAvatar.public_id)

        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
          folder: 'users',
          width: 150
        })

        const updateSuccess = await UserRepository.updateUserAvatar(id, myCloud.public_id, myCloud.secure_url)

        if (updateSuccess) {
          response(res, true, StatusCodes.OK, 'Imagem de perfil atualizada.')
        }

        response(res, false, StatusCodes.BAD_REQUEST, 'Ocorreu um erro ao atualizar a imagem.')
      }
    } catch (error) {
      console.error('Erro ao atualizar imagem:', error.message)
      response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao atualizar a sua imagem. Tente mais tarde.')
    }
  }
}
