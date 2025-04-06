import { StatusCodes } from 'http-status-codes'
import cloudinary from 'cloudinary'

import { handleError, HttpException } from '../utils/error-handler.js'
import { hashPassword } from '../utils/password.js'
import response from '../utils/response.js'
import UserRepository from '../repositories/user-repository.js'
import PasswordService from '../services/password-service.js'
import EmailService from '../services/email-service.js'

class UserController {
  static async getUserById (req, res) {
    const { id } = req.params

    try {
      const user = await UserRepository.getUserById(id)

      if (!user) {
        throw new HttpException('Utilizador não encontrado.', StatusCodes.NOT_FOUND)
      }

      return response(res, true, StatusCodes.OK, user)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar o utilizador.')
    }
  }

  static async getAllUsers (req, res) {
    try {
      const users = await UserRepository.getAllUsers()

      return response(res, true, StatusCodes.OK, users)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar os utilizadores.')
    }
  }

  static async deleteUser (req, res) {
    const { id } = req.params

    try {
      const result = await UserRepository.deleteUser(id)

      if (!result) {
        throw new HttpException('Utilizador não encontrado.', StatusCodes.NOT_FOUND)
      }

      return response(res, true, StatusCodes.OK, 'User deleted')
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao eliminar o utilizador.')
    }
  }

  static async updateUser (req, res) {
    const data = req.body
    const id = req.user.Utilizador_ID

    try {
      const existingUser = await UserRepository.getUserById(id)

      const updatedData = {
        name: data.name || existingUser.Nome,
        contact: data.contact || existingUser.Contacto
      }

      await UserRepository.updateUser(updatedData, id)

      return response(res, true, StatusCodes.OK, 'Utilizador atualizado som sucesso.')
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao atualizar o utilizador.')
    }
  }

  static async getUserByEmail (req, res) {
    const { email } = req.params

    try {
      const user = await UserRepository.getUserByEmail(email)

      if (!user) {
        throw new HttpException('Utilizador não encontrado.', StatusCodes.NOT_FOUND)
      }

      return response(res, true, StatusCodes.OK, user)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar o utilizador.')
    }
  }

  static async getUserInfo (req, res) {
    const id = req.user.Utilizador_ID

    try {
      const user = await UserRepository.getUserById(id)

      return response(res, true, StatusCodes.OK, user)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar o utilizador.')
    }
  }

  static async updateUserPassword (req, res) {
    const id = req.user.Utilizador_ID
    const { newPassword, confirmPassword } = req.body

    if (newPassword !== confirmPassword) {
      return response(res, false, StatusCodes.BAD_REQUEST, 'Palavra-passe incorreta!')
    }

    try {
      const hashedPassword = await hashPassword(newPassword)

      await UserRepository.updateUserPassword(id, hashedPassword)

      return response(res, true, StatusCodes.OK, 'Palavra-passe atualizada com sucesso.')
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao atualizar a palavra-passe.')
    }
  }

  static async sendNewPasswordEmail (req, res) {
    const { email } = req.body

    try {
      const user = await UserRepository.getUserByEmail(email)

      if (!user) {
        throw new HttpException('Utilizador não encontrado.', StatusCodes.NOT_FOUND)
      }

      const newPassword = await PasswordService.generateAndStoreNewPassword(user.Utilizador_ID)

      const emailData = { user, newPassword }

      await EmailService.prepareEmailContent('new-password.ejs', emailData)

      await EmailService.sendEmail({
        email: user.Email,
        subject: 'Nova palavra-passe',
        template: 'new-password.ejs',
        emailData
      })

      return response(res, true, StatusCodes.OK, 'Verifique o seu email para verificar a sua nova palavra-passe.')
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao enviar o email para a sua conta.')
    }
  }

  static async uploadUserAvatar (req, res) {
    const id = req.user.Utilizador_ID
    const { thumbnail } = req.body

    try {
      const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
        folder: 'users'
      })

      const uploadSuccess = await UserRepository.uploadUserAvatar(id, myCloud.public_id, myCloud.url)

      if (uploadSuccess) {
        return response(res, true, StatusCodes.OK, 'Imagem inserida.')
      }

      return response(res, false, StatusCodes.BAD_REQUEST, 'Ocorreu um erro ao inserir a imagem.')
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao fazer upload da imagem.')
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
          return response(res, true, StatusCodes.OK, 'Imagem de perfil atualizada.')
        }

        return response(res, false, StatusCodes.BAD_REQUEST, 'Ocorreu um erro ao atualizar a imagem.')
      }
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao atualizar a imagem.')
    }
  }
}

export default UserController
