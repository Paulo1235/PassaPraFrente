import { describe, it, expect, vi, beforeEach } from 'vitest'
import AuthController from '../../src/controllers/auth-controller.js'
import UserRepository from '../../src/repositories/user-repository.js'
import EmailService from '../../src/services/email-service.js'
import { comparePassword } from '../../src/utils/password.js'
import { sendToken, createActivationToken } from '../../src/utils/jwt.js'
import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'

vi.mock('../../src/repositories/user-repository.js')
vi.mock('../../src/services/email-service.js')
vi.mock('../../src/utils/password.js')
vi.mock('../../src/utils/jwt.js')
vi.mock('jsonwebtoken')

describe('AuthController', () => {
  let req, res, next

  beforeEach(() => {
    req = { body: {}, headers: {}, user: {}, cookies: {} }
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      setHeader: vi.fn(),
      cookie: vi.fn()
    }
    next = vi.fn()
    vi.clearAllMocks()
  })

  describe('loginUser', () => {
    it('deve retornar erro se email ou senha estiverem incorretos', async () => {
      req.body = { email: 'email', password: '123' }
      UserRepository.getUserByEmail.mockResolvedValue(null)

      await AuthController.loginUser(req, res)

      expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED)
    })

    it('deve fazer login com sucesso se as credenciais forem válidas', async () => {
      req.body = { email: 'email', password: '123' }

      UserRepository.getUserByEmail.mockResolvedValue({ Password: 'hashed' })
      comparePassword.mockResolvedValue(true)

      await AuthController.loginUser(req, res)

      expect(sendToken).toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
    })
  })

  describe('logoutUser', () => {
    it('deve limpar os cookies e retornar sucesso', async () => {
      await AuthController.logoutUser(req, res)

      expect(res.cookie).toHaveBeenCalledWith('accessToken', '')
      expect(res.cookie).toHaveBeenCalledWith('refreshToken', '')
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
    })
  })

  describe('sendAccountActivationEmail', () => {
    it('deve enviar email de ativação', async () => {
      req.user = { Email: 'email' }
      const token = { activationCode: 'code', token: 'token' }
      createActivationToken.mockReturnValue(token)

      await AuthController.sendAccountActivationEmail(req, res)

      expect(EmailService.sendEmail).toHaveBeenCalled()
    })
  })

  describe('activateUser', () => {
    it('deve ativar utilizador se token e código forem válidos', async () => {
      req.user = { Utilizador_ID: 1 }
      req.body = { activationCode: '123' }
      req.headers['x-activation-token'] = 'token'

      UserRepository.getUserById.mockResolvedValue({ ConfirmarEmail: 0 })
      jwt.verify.mockReturnValue({ activationCode: '123' })

      await AuthController.activateUser(req, res)

      expect(UserRepository.activateUser).toHaveBeenCalledWith(1)
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
    })

    it('deve retornar erro se a conta já estiver ativada', async () => {
      req.user = { Utilizador_ID: 1 }
      UserRepository.getUserById.mockResolvedValue({ ConfirmarEmail: 1 })

      await AuthController.activateUser(req, res)

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
    })
  })

  describe('refreshAccessToken', () => {
    it('deve gerar novo token se o refresh token for válido', async () => {
      req.cookies.refreshToken = 'valid'
      jwt.verify.mockReturnValue({ id: 1 })
      UserRepository.getUserById.mockResolvedValue({ id: 1 })

      await AuthController.refreshAccessToken(req, res, next)

      expect(sendToken).toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    })

    it('deve retornar erro se o refresh token estiver ausente', async () => {
      await AuthController.refreshAccessToken(req, res, next)

      expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED)
    })
  })
})
