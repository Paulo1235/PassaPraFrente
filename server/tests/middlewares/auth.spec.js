import { describe, it, expect, vi, beforeEach } from 'vitest'
import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'

import AuthMiddleware from '../../src/middlewares/auth-middleware.js'
import UserRepository from '../../src/repositories/user-repository.js'
import response from '../../src/utils/response.js'
import { ACCESS_TOKEN_SECRET_KEY } from '../../config.js'
import { generateAccessToken } from '../../src/utils/jwt.js'
import { VERIFIED_USER } from '../../src/constants/user-constants.js'

vi.mock('../../src/repositories/user-repository.js')
vi.mock('../../src/utils/jwt.js')

vi.mock('jsonwebtoken', () => ({
  default: {
    verify: vi.fn()
  }
}))

vi.mock('../../src/utils/response.js', () => ({
  default: vi.fn()
}))

const criaReqResNext = (accessToken, user) => ({
  req: { cookies: { accessToken }, user },
  res: { status: vi.fn().mockReturnThis(), json: vi.fn() },
  next: vi.fn()
})

describe('Testes de autenticação e autorização', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve permitir o acesso se o token for válido', async () => {
    const validUser = { Utilizador_ID: 123 }

    generateAccessToken.mockReturnValue('valid-token-123')
    const validToken = generateAccessToken({ id: validUser.Utilizador_ID })

    const { req, res, next } = criaReqResNext(validToken, null)

    jwt.verify.mockReturnValue({ id: validUser.Utilizador_ID })

    UserRepository.getUserById.mockResolvedValue(validUser)

    await AuthMiddleware.isAuthenticated(req, res, next)

    expect(jwt.verify).toHaveBeenCalledWith(validToken, ACCESS_TOKEN_SECRET_KEY)

    expect(UserRepository.getUserById).toHaveBeenCalledWith(validUser.Utilizador_ID)

    expect(req.user).toEqual(validUser)

    expect(next).toHaveBeenCalled()
  })

  it('deve retornar não autorizado se token não existir', async () => {
    const { req, res, next } = criaReqResNext(undefined, null)

    jwt.verify.mockResolvedValue(new Error('Token inválido'))

    await AuthMiddleware.isAuthenticated(req, res, next)

    expect(response).toHaveBeenCalledWith(res, false, StatusCodes.UNAUTHORIZED, 'Não se encontra logado!')
  })

  it('deve permitir acesso se o utilizador estiver verificado', async () => {
    const user = { ConfirmarEmail: VERIFIED_USER.VERIFIED }
    const { req, res, next } = criaReqResNext(null, user)

    await AuthMiddleware.isVerified(req, res, next)

    expect(next).toHaveBeenCalled()

    expect(response).not.toHaveBeenCalled()
  })

  it('deve retornar status 401 se o utilizador não estiver verificado', async () => {
    const user = { ConfirmarEmail: VERIFIED_USER.UNVERIFIED }
    const { req, res, next } = criaReqResNext(null, user)

    await AuthMiddleware.isVerified(req, res, next)

    expect(response).toHaveBeenCalledWith(
      res,
      false,
      StatusCodes.UNAUTHORIZED,
      'A sua conta não está verificada.'
    )

    expect(next).not.toHaveBeenCalled()
  })
})
