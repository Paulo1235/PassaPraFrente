import crypto from 'node:crypto'
import path from 'node:path'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import ejs from 'ejs'

import { UserRepository } from '../repositories/user-repository.js'
import { ErrorApplication } from '../utils/error-handler.js'
import { comparePassword, hashPassword } from '../utils/bcrypt.js'
import { sendToken } from '../utils/jwt.js'
import { response } from '../utils/response.js'
import { ACCESS_TOKEN_SECRET_KEY, ACCESS_TOKEN_EXPIRE, DIRNAME } from '../../config.js'
import { sendEmail } from '../utils/send-email.js'

export class AuthController {
  static async createUser (req, res) {
    const { name, birthDate, imageUrl, contact, email, password, confirmPassword } = req.body

    try {
      const existingUser = await UserRepository.getUserByEmail(email)

      if (existingUser) {
        throw new ErrorApplication('User already exists', StatusCodes.CONFLICT)
      }

      if (password !== confirmPassword) {
        throw new ErrorApplication('Incorrect password', StatusCodes.BAD_REQUEST)
      }

      const hashedPassword = await hashPassword(password)
      const confirmarEmail = 0 // padeiro

      const user = {
        name,
        birthDate,
        imageUrl,
        contact,
        email,
        password: hashedPassword,
        confirmarEmail
      }

      const activationToken = await AuthController.createActivationToken(user)

      const activationCode = activationToken.activationCode

      const data = { user, activationCode }

      await ejs.renderFile(path.join(DIRNAME, 'src/mails/activation-mail.ejs'), data)

      await sendEmail({
        email: user.email,
        subject: 'Ativação de conta',
        template: 'activation-mail.ejs',
        data
      })

      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Check your email for account verification',
        activationToken: activationToken.token
      })
    } catch (error) {
      if (error instanceof ErrorApplication) {
        response(res, false, error.statusCodes, error.message)
      } else {
        console.error('Internal error: ', error.message)
        response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while creating an user')
      }
    }
  }

  static async loginUser (req, res) {
    const { email, password } = req.body

    try {
      const user = await UserRepository.getUserByEmail(email)

      if (!user) {
        throw new ErrorApplication('User could not be found', StatusCodes.NOT_FOUND)
      }

      const isMatch = await comparePassword(password, user.Password)

      if (!isMatch) {
        throw new ErrorApplication('Incorrect password', StatusCodes.BAD_REQUEST)
      }

      // const { password, ...publicUser } = user

      sendToken(user, StatusCodes.OK, res)
    } catch (error) {
      if (error instanceof ErrorApplication) {
        response(res, false, error.statusCodes, error.message)
      } else {
        console.error('Internal error: ', error.message)
        response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while creating an user')
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

  static async createActivationToken (user) {
    const activationCode = crypto.randomInt(1000, 10000).toString()

    const token = jwt.sign(
      { user, activationCode },
      ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: ACCESS_TOKEN_EXPIRE * 60 }
    )

    return { token, activationCode }
  }
}
