import { describe, it, expect, vi, beforeEach } from 'vitest'
import UserController from '../../src/controllers/user-controller.js'
import response from '../../src/utils/response.js'
import UserRepository from '../../src/repositories/user-repository.js'
import { hashPassword } from '../../src/utils/password.js'
import { StatusCodes } from 'http-status-codes'

vi.mock('../../src/repositories/user-repository.js', () => ({
  default: {
    getUserById: vi.fn(),
    updateUser: vi.fn(),
    updateUserPassword: vi.fn()
  }
}))

vi.mock('../../src/utils/password.js', () => ({
  hashPassword: vi.fn()
}))

vi.mock('../../src/utils/response.js', () => ({
  default: vi.fn()
}))

describe('UserController', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('updateUser', () => {
    it('deve atualizar o utilizador com sucesso', async () => {
      const req = {
        body: {
          name: 'Updated User',
          contact: '123456789'
        },
        user: {
          Utilizador_ID: 1
        }
      }
      const res = {}

      const existingUser = { Utilizador_ID: 1, Nome: 'Old User', Contacto: '987654321' }

      UserRepository.getUserById.mockResolvedValue(existingUser)

      UserRepository.updateUser.mockResolvedValue(true)

      await UserController.updateUser(req, res)

      expect(UserRepository.getUserById).toHaveBeenCalledWith(1)

      expect(UserRepository.updateUser).toHaveBeenCalledWith(
        { name: 'Updated User', contact: '123456789' },
        1
      )

      expect(response).toHaveBeenCalledWith(res, true, StatusCodes.OK, 'Utilizador atualizado som sucesso.')
    })

    it('deve atualizar o utilizador com dados não fornecidos e manter os antigos', async () => {
      const req = {
        body: { contact: '123456789' },
        user: {
          Utilizador_ID: 1
        }
      }
      const res = {}

      const existingUser = { Utilizador_ID: 1, Nome: 'Old User', Contacto: '987654321' }

      UserRepository.getUserById.mockResolvedValue(existingUser)

      UserRepository.updateUser.mockResolvedValue(true)

      await UserController.updateUser(req, res)

      expect(UserRepository.getUserById).toHaveBeenCalledWith(1)

      expect(UserRepository.updateUser).toHaveBeenCalledWith(
        { name: 'Old User', contact: '123456789' },
        1
      )

      expect(response).toHaveBeenCalledWith(res, true, StatusCodes.OK, 'Utilizador atualizado som sucesso.')
    })
  })

  describe('updateUserPassword', () => {
    it('deve retornar erro se as palavras-passe não coincidirem', async () => {
      const req = {
        user: { Utilizador_ID: 1 },
        body: { newPassword: 'new123', confirmPassword: 'new321' }
      }
      const res = {}

      await UserController.updateUserPassword(req, res)

      expect(response).toHaveBeenCalledWith(res, false, StatusCodes.BAD_REQUEST, 'As palavra-passe são diferentes!')
    })

    it('deve atualizar a senha com sucesso', async () => {
      const req = {
        user: { Utilizador_ID: 1 },
        body: { newPassword: 'newPassword123', confirmPassword: 'newPassword123' }
      }
      const res = {}

      const hashedPassword = 'hashedNewPassword123'

      hashPassword.mockResolvedValue(hashedPassword)

      UserRepository.updateUserPassword.mockResolvedValue(true)

      await UserController.updateUserPassword(req, res)

      expect(hashPassword).toHaveBeenCalledWith('newPassword123')
      expect(UserRepository.updateUserPassword).toHaveBeenCalledWith(1, hashedPassword)
      expect(response).toHaveBeenCalledWith(res, true, StatusCodes.OK, 'Palavra-passe atualizada com sucesso.')
    })

    it('deve retornar erro se falhar ao atualizar a senha', async () => {
      const req = {
        user: { Utilizador_ID: 1 },
        body: { newPassword: 'newPassword123', confirmPassword: 'newPassword123' }
      }
      const res = {}

      hashPassword.mockResolvedValue('hashedNewPassword123')

      UserRepository.updateUserPassword.mockRejectedValue(new Error('Erro ao atualizar'))

      await UserController.updateUserPassword(req, res)

      expect(response).toHaveBeenCalledWith(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao atualizar a palavra-passe.')
    })
  })
})
