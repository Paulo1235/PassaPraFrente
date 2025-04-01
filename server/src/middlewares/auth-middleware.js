import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'

import { response } from '../utils/response.js'
import { ACCESS_TOKEN_SECRET_KEY } from '../../config.js'
import { UserRepository } from '../repositories/user-repository.js'
import { ErrorApplication } from '../utils/error-handler.js'

export class AuthMiddleware {
  static async isAuthenticated (req, res, next) {
    const accessToken = req.cookies?.accessToken
    // const authorizationHeader = req.headers.authorization
    try {
      // if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      //   throw new ErrorApplication('Não se encontra logado.', StatusCodes.UNAUTHORIZED)
      // }

      if (!accessToken) {
        throw new ErrorApplication('Não se encontra logado!', StatusCodes.UNAUTHORIZED)
      }

      // const accessToken = authorizationHeader.split(' ')[1]

      const payload = jwt.verify(accessToken, ACCESS_TOKEN_SECRET_KEY)

      if (!payload) {
        throw new ErrorApplication('Acesso inválido.', StatusCodes.UNAUTHORIZED)
      }

      const user = await UserRepository.getUserById(payload.id)

      if (!user) {
        throw new ErrorApplication('Utilizador não encontrado', StatusCodes.NOT_FOUND)
      }

      req.user = user

      next()
    } catch (error) {
      if (error instanceof ErrorApplication) {
        response(res, false, error.statusCodes, error.message)
      } else {
        console.error('Internal error: ', error.message)
        response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao autenticar o utilizador. Tente fazer login novamente.')
      }
    }
  }

  static async isVerified (req, res, next) {
    const user = req.user

    if (!user) {
      throw new ErrorApplication('Utilizador não encontrado', StatusCodes.NOT_FOUND)
    }

    if (user.ConfirmarEmail !== 1) {
      throw new ErrorApplication('A sua conta não está verificada', StatusCodes.BAD_REQUEST)
    }

    next()
  }

  static authorizedRoles (roles) {
    return async (req, res, next) => {
      const id = req.user.Utilizador_ID

      const role = await UserRepository.getUserRole(id)

      if (!roles.includes(role)) {
        response(res, true, StatusCodes.UNAUTHORIZED, 'Não tem acesso a esta rota')
        return
      }

      next()
    }
  }
}
