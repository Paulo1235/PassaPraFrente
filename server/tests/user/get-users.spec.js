import { expect, it } from 'vitest'
import UserRepository from '../../src/repositories/user-repository.js'
import UserController from '../../src/controllers/user-controller.js'
import { response } from '../../src/utils/response.js'

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

  expect(response).toHaveBeenCalledWith(res, true, 200, fakeUsers)
})
