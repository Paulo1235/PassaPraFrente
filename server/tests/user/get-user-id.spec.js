import { describe, it, expect, vi, beforeEach } from 'vitest'
import UserController from '../../src/controllers/user-controller.js'
import response from '../../src/utils/response.js'
import UserRepository from '../../src/repositories/user-repository.js'

vi.mock('../../src/repositories/user-repository.js', async () => {
  return {
    default: {
      getUserById: vi.fn()
    }
  }
})

vi.mock('../../src/utils/response.js', () => ({
  default: vi.fn()
}))

describe('UserController.getUserById', () => {
  beforeEach(() => {
    vi.clearAllMocks()
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

    expect(response).toHaveBeenCalledWith(res, true, 404, 'Utilizador não encontrado.')
  })
})
