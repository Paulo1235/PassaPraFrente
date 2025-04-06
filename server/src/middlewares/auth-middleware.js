import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'

import { ACCESS_TOKEN_SECRET_KEY } from '../../config.js'
import { handleError, HttpException } from '../utils/error-handler.js'
import response from '../utils/response.js'
import UserRepository from '../repositories/user-repository.js'

class AuthMiddleware {
  static async isAuthenticated (req, res, next) {
    const accessToken = req.cookies?.accessToken

    try {
      if (!accessToken) {
        throw new HttpException('Não se encontra logado!', StatusCodes.UNAUTHORIZED)
      }

      const payload = jwt.verify(accessToken, ACCESS_TOKEN_SECRET_KEY)

      if (!payload) {
        throw new HttpException('Acesso inválido.', StatusCodes.UNAUTHORIZED)
      }

      const user = await UserRepository.getUserById(payload.id)

      if (!user) {
        throw new HttpException('Utilizador não encontrado', StatusCodes.NOT_FOUND)
      }

      req.user = user

      next()
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao autenticar o utilizador.')
    }
  }

  static async isVerified (req, res, next) {
    const user = req.user

    if (!user) {
      return response(res, false, StatusCodes.NOT_FOUND, 'Utilizador não encontrado.')
    }

    if (user.ConfirmarEmail !== 1) {
      return response(res, false, StatusCodes.UNAUTHORIZED, 'A sua conta não está verificada.')
    }

    next()
  }

  static authorizedRoles (roles) {
    return async (req, res, next) => {
      const id = req.user.Utilizador_ID

      const role = await UserRepository.getUserRole(id)

      if (!roles.includes(role.TipoUtilizador)) {
        return response(res, true, StatusCodes.UNAUTHORIZED, 'Não tem acesso a esta rota.')
      }

      next()
    }
  }
}

export default AuthMiddleware
