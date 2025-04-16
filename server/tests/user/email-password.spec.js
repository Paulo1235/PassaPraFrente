import { describe, it, expect, vi, beforeEach } from 'vitest'
import UserController from '../../src/controllers/user-controller.js'
import UserRepository from '../../src/repositories/user-repository.js'
import EmailService from '../../src/services/email-service.js'
import PasswordService from '../../src/services/password-service.js'
import response from '../../src/utils/response.js'
import { StatusCodes } from 'http-status-codes'

// Mocka as dependências
vi.mock('../../src/repositories/user-repository.js', () => ({
  default: {
    getUserByEmail: vi.fn()
  }
}))

vi.mock('../../src/services/email-service.js', () => ({
  default: {
    prepareEmailContent: vi.fn(),
    sendEmail: vi.fn()
  }
}))

vi.mock('../../src/services/password-service.js', () => ({
  default: {
    generateAndStoreNewPassword: vi.fn()
  }
}))

vi.mock('../../src/utils/response.js', () => ({
  default: vi.fn()
}))

describe('UserController.sendNewPasswordEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve enviar o email de nova senha com sucesso', async () => {
    const req = {
      body: {
        email: 'test@example.com'
      }
    }
    const res = {}

    const fakeUser = { Utilizador_ID: 1, Email: 'test@example.com' }
    const fakeNewPassword = 'newPassword123'

    // Mocks
    UserRepository.getUserByEmail.mockResolvedValue(fakeUser)
    PasswordService.generateAndStoreNewPassword.mockResolvedValue(fakeNewPassword)
    EmailService.prepareEmailContent.mockResolvedValue(true)
    EmailService.sendEmail.mockResolvedValue(true)

    await UserController.sendNewPasswordEmail(req, res)

    expect(UserRepository.getUserByEmail).toHaveBeenCalledWith('test@example.com')
    expect(PasswordService.generateAndStoreNewPassword).toHaveBeenCalledWith(1)
    expect(EmailService.prepareEmailContent).toHaveBeenCalledWith('new-password.ejs', { user: fakeUser, newPassword: fakeNewPassword })

    expect(EmailService.sendEmail).toHaveBeenCalledWith({
      email: fakeUser.Email,
      subject: 'Nova palavra-passe',
      template: 'new-password.ejs',
      emailData: { user: fakeUser, newPassword: fakeNewPassword }
    })
    expect(response).toHaveBeenCalledWith(res, true, StatusCodes.OK, 'Verifique o seu email para verificar a sua nova palavra-passe.')
  })

  it('deve lançar erro se o email não for encontrado', async () => {
    const req = {
      body: {
        email: 'invalid@example.com'
      }
    }
    const res = {}

    UserRepository.getUserByEmail.mockResolvedValue(null)

    await UserController.sendNewPasswordEmail(req, res)

    expect(response).toHaveBeenCalledWith(res, false, StatusCodes.NOT_FOUND, 'Email inválido.')
  })

  it('deve retornar erro se falhar ao enviar o email', async () => {
    const req = {
      body: {
        email: 'test@example.com'
      }
    }
    const res = {}

    const fakeUser = { Utilizador_ID: 1, Email: 'test@example.com' }
    const fakeNewPassword = 'newPassword123'

    UserRepository.getUserByEmail.mockResolvedValue(fakeUser)
    PasswordService.generateAndStoreNewPassword.mockResolvedValue(fakeNewPassword)
    EmailService.prepareEmailContent.mockResolvedValue(true)
    EmailService.sendEmail.mockRejectedValue(new Error('Falha no envio de email'))

    await UserController.sendNewPasswordEmail(req, res)

    expect(response).toHaveBeenCalledWith(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao enviar o email para a sua conta.')
  })
})
