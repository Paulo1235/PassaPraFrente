import { describe, it, expect, vi, beforeEach } from 'vitest'
import UserController from '../../src/controllers/user-controller.js'
import response from '../../src/utils/response.js'
import UserRepository from '../../src/repositories/user-repository.js'
import { StatusCodes } from 'http-status-codes'

vi.mock('../../src/repositories/user-repository.js', () => ({
  default: {
    getAllUsers: vi.fn(),
    getUserByEmail: vi.fn(),
    getUserById: vi.fn(),
    getUserInfo: vi.fn(),
    getUserWithAvatar: vi.fn()
  }
}))

vi.mock('../../src/utils/response.js', () => ({
  default: vi.fn()
}))

describe('UserController', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Teste para getAllUsers
  describe('getAllUsers', () => {
    it('deve retornar lista de utilizadores com sucesso', async () => {
      const req = {}
      const res = {}

      const fakeUsers = [
        { Utilizador_ID: 1, Nome: 'User 1' },
        { Utilizador_ID: 2, Nome: 'User 2' }
      ]

      UserRepository.getAllUsers.mockResolvedValue(fakeUsers)

      await UserController.getAllUsers(req, res)

      expect(UserRepository.getAllUsers).toHaveBeenCalled()
      expect(response).toHaveBeenCalledWith(res, true, StatusCodes.OK, fakeUsers)
    })
  })

  // Teste para getUserByEmail
  describe('getUserByEmail', () => {
    it('deve retornar o utilizador se encontrado', async () => {
      const req = { params: { email: 'test@example.com' } }
      const res = {}

      const fakeUser = { Utilizador_ID: 1, Nome: 'User Test', Email: 'test@example.com' }

      UserRepository.getUserByEmail.mockResolvedValue(fakeUser)

      await UserController.getUserByEmail(req, res)

      expect(UserRepository.getUserByEmail).toHaveBeenCalledWith('test@example.com')
      expect(response).toHaveBeenCalledWith(res, true, StatusCodes.OK, fakeUser)
    })

    it('deve retornar objeto vazio se utilizador não for encontrado', async () => {
      const req = { params: { email: 'nonexistent@example.com' } }
      const res = {}

      UserRepository.getUserByEmail.mockResolvedValue(null)

      await UserController.getUserByEmail(req, res)

      expect(UserRepository.getUserByEmail).toHaveBeenCalledWith('nonexistent@example.com')
      expect(response).toHaveBeenCalledWith(res, false, StatusCodes.NOT_FOUND, 'Utilizador não encontrado.')
    })
  })

  it('deve retornar um utilizador se existir', async () => {
    const req = { params: { id: 3 } }
    const res = {}
    const fakeUser = { Utilizador_ID: 3, Nome: 'Teste' }

    UserRepository.getUserById.mockResolvedValue(fakeUser)

    await UserController.getUserById(req, res)

    expect(UserRepository.getUserById).toHaveBeenCalledWith(3)

    expect(response).toHaveBeenCalledWith(res, true, 200, fakeUser)
  })

  it('deve retornar objeto vazio se utilizador não for encontrado', async () => {
    const req = { params: { id: 999 } }
    const res = {}

    UserRepository.getUserById.mockResolvedValue(null)

    await UserController.getUserById(req, res)

    expect(UserRepository.getUserById).toHaveBeenCalledWith(999)

    expect(response).toHaveBeenCalledWith(res, false, 404, 'Utilizador não encontrado.')
  })

  it('deve retornar utilizador com avatar se o avatar estiver presente', async () => {
    const req = { user: { Utilizador_ID: 1 } }
    const res = {}

    const fakeUser = { Utilizador_ID: 1, Nome: 'User Test', PublicID: 'public_id', Url: 'url_to_avatar' }

    UserRepository.getUserWithAvatar.mockResolvedValue(fakeUser)

    await UserController.getUserInfo(req, res)

    expect(UserRepository.getUserWithAvatar).toHaveBeenCalledWith(1)
    expect(response).toHaveBeenCalledWith(res, true, StatusCodes.OK, fakeUser)
  })

  it('deve retornar utilizador sem avatar e consultar getUserById se avatar não existir', async () => {
    const req = { user: { Utilizador_ID: 1 } }
    const res = {}

    const fakeUserWithoutAvatar = { Utilizador_ID: 1, Nome: 'User Test' }

    UserRepository.getUserWithAvatar.mockResolvedValue({ PublicID: null, Url: null })

    UserRepository.getUserById.mockResolvedValue(fakeUserWithoutAvatar)

    await UserController.getUserInfo(req, res)

    expect(UserRepository.getUserWithAvatar).toHaveBeenCalledWith(1)

    expect(UserRepository.getUserById).toHaveBeenCalledWith(1)

    expect(response).toHaveBeenCalledWith(res, true, StatusCodes.OK, fakeUserWithoutAvatar)
  })
})
