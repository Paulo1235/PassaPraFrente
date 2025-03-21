import crypto from 'node:crypto'
import path from 'node:path'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import ejs from 'ejs'

import { UserRepository } from '../repositories/user-repository.js'
import { ErrorApplication } from '../utils/error-handler.js'
import { comparePassword, hashPassword } from '../utils/bcrypt.js'
import { generateAccessToken, generateRefreshToken, sendToken } from '../utils/jwt.js'
import { response } from '../utils/response.js'
import { ACCESS_TOKEN_SECRET_KEY, DIRNAME, ACTIVATION_CODE_EXPIRE, REFRESH_TOKEN_SECRET_KEY } from '../../config.js'
import { sendEmail } from '../utils/send-email.js'

export class AuthController {
  static async createUser (req, res) {
    const { name, birthDate, imageUrl, contact, email, password, confirmPassword } = req.body

    if (password !== confirmPassword) {
      response(res, false, StatusCodes.BAD_REQUEST, 'Incorrect password')
    }

    try {
      // const existingUser = await UserRepository.getUserByEmail(email)

      const existingUser = await UserRepository.existsUserByEmail(email)

      if (existingUser) {
        throw new ErrorApplication('Utilizador já existe.', StatusCodes.CONFLICT)
      }

      const hashedPassword = await hashPassword(password)

      const user = {
        name,
        birthDate,
        imageUrl,
        contact,
        email,
        password: hashedPassword
      }

      const createdUser = await UserRepository.createUser(user)

      if (!createdUser) {
        throw new ErrorApplication('Não foi possível criar conta.', StatusCodes.BAD_REQUEST)
      }

      response(res, true, StatusCodes.CREATED, createdUser)
    } catch (error) {
      if (error instanceof ErrorApplication) {
        response(res, false, error.statusCodes, error.message)
      } else {
        console.error('Erro ao criar conta: ', error.message)
        response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao criar a conta.')
      }
    }
  }

  static async loginUser (req, res) {
    const { email, password } = req.body

    try {
      const user = await UserRepository.getUserByEmail(email)

      if (!user) {
        throw new ErrorApplication('Utilizador não encontrado.', StatusCodes.NOT_FOUND)
      }

      const isMatch = await comparePassword(password, user.Password)

      if (!isMatch) {
        throw new ErrorApplication('Palavra-passe incorreta', StatusCodes.BAD_REQUEST)
      }

      const { Password: _, ...publicUser } = user

      sendToken(publicUser, StatusCodes.OK, res)
    } catch (error) {
      if (error instanceof ErrorApplication) {
        response(res, false, error.statusCodes, error.message)
      } else {
        console.error('Internal error: ', error.message)
        response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while logging in')
      }
    }
  }

  static async logoutUser (req, res) {
    try {
      res.cookie('accessToken', '')
      res.cookie('refreshToken', '')

      response(res, true, StatusCodes.OK, 'Logged out successfully')
    } catch (error) {
      console.error('Internal error: ', error.message)
      response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while logging out')
    }
  }

  static createActivationToken (user) {
    const activationCode = crypto.randomInt(1000, 10000).toString()

    const token = jwt.sign(
      { user, activationCode },
      ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: ACTIVATION_CODE_EXPIRE * 60 * 60 }
    )

    return { token, activationCode }
  }

  static async sendAccountActivationEmail (req, res) {
    const user = req.user

    const activationToken = AuthController.createActivationToken(user)

    const activationCode = activationToken.activationCode

    const data = { user, activationCode }

    try {
      await ejs.renderFile(path.join(DIRNAME, 'src/mails/activation-mail.ejs'), data)

      await sendEmail({
        email: user.Email,
        subject: 'Ativação de conta',
        template: 'activation-mail.ejs',
        data
      })

      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Verifique o seu email para ativar a conta.',
        activationToken: activationToken.token
      })
    } catch (error) {
      console.error('Erro ao enviar o email', error.message)
      response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao enviar o email para a sua conta.')
    }
  }

  static async activateUser (req, res) {
    const id = req.user.Utilizador_ID

    const { activationToken, activationCode } = req.body

    try {
      const token = jwt.verify(activationToken, ACCESS_TOKEN_SECRET_KEY)

      if (token.activationCode !== activationCode) {
        throw new ErrorApplication('Código de ativação incorreto.', StatusCodes.BAD_REQUEST)
      }

      const user = await UserRepository.activateUser(id)

      if (!user) {
        throw new ErrorApplication('Ocorreu erro ao ativar conta.', StatusCodes.BAD_REQUEST)
      }

      response(res, true, StatusCodes.OK, 'Conta ativada com sucesso.')
    } catch (error) {
      if (error instanceof ErrorApplication) {
        response(res, false, error.statusCodes, error.message)
      } else {
        console.error('Erro ao ativar a conta: ', error.message)
        response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao ativar a sua conta.')
      }
    }
  }

  static async refreshAccessToken (req, res, next) {
    const refreshToken = req.headers.refresh

    try {
      if (!refreshToken) {
        throw new ErrorApplication('Não foi possível encontrar a sessão. Tente mais tarde', StatusCodes.UNAUTHORIZED)
      }

      const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY)

      if (!decoded) {
        throw new ErrorApplication('Sem autorização', StatusCodes.UNAUTHORIZED)
      }

      if (!decoded) {
        throw new ErrorApplication('Sessão expirada. Faça login novamente.', StatusCodes.UNAUTHORIZED)
      }

      const user = { id: decoded.id }

      const newAccessToken = generateAccessToken(user)

      const newRefreshToken = generateRefreshToken(user)

      req.user = user

      res.setHeader('Authorization', `Bearer ${newAccessToken}`)
      res.setHeader('X-Refresh-Token', newRefreshToken)

      response(res, true, StatusCodes.OK, 'Sessão renovada com sucesso.')
    } catch (error) {
      if (error instanceof ErrorApplication) {
        response(res, false, error.statusCodes, error.message)
      } else {
        console.error('Erro ao refreshar o token: ', error.message)
        response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao renovar sua sessão. Tente novamente mais tarde.')
      }
    }
  }
}
