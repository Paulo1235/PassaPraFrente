import { describe, it, expect, vi, beforeEach } from 'vitest'
import AuthMiddleware from '../../src/middlewares/auth-middleware.js'
import UserRepository from '../../src/repositories/user-repository.js'
import { StatusCodes } from 'http-status-codes'
import response from '../../src/utils/response.js'

vi.mock('../../src/repositories/user-repository.js')
vi.mock('../../src/utils/response.js', () => ({
  default: vi.fn()
}))

const criaReqResNext = (userId) => ({
  req: { user: { Utilizador_ID: userId } },
  res: { status: vi.fn().mockReturnThis(), json: vi.fn() },
  next: vi.fn()
})

describe('Testes para verificar idade do utilizador', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve permitir acesso se o utilizador for maior de idade', async () => {
    const { req, res, next } = criaReqResNext(1)

    const birthDate = new Date()
    birthDate.setFullYear(birthDate.getFullYear() - 20)

    UserRepository.getUserById.mockResolvedValue({ DataNasc: birthDate })

    await AuthMiddleware.isAdult(req, res, next)

    expect(next).toHaveBeenCalled()
  })

  it('deve bloquear o acesso se o utilizador for menor de idade', async () => {
    const { req, res, next } = criaReqResNext(2)

    const birthDate = new Date()
    birthDate.setFullYear(birthDate.getFullYear() - 16)

    UserRepository.getUserById.mockResolvedValue({ DataNasc: birthDate })

    await AuthMiddleware.isAdult(req, res, next)

    expect(next).not.toHaveBeenCalled()

    expect(response).toHaveBeenCalledWith(
      res,
      false,
      StatusCodes.UNAUTHORIZED,
      'Não tem idade suficiente para realizar esta tarefa!'
    )
  })

  it('deve tratar erros inesperados', async () => {
    const { req, res, next } = criaReqResNext(3)

    UserRepository.getUserById.mockRejectedValue(new Error('Falha inesperada'))

    await AuthMiddleware.isAdult(req, res, next)

    expect(next).not.toHaveBeenCalled()

    expect(response).toHaveBeenCalledWith(
      res,
      false,
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Ocorreu um erro ao verificar se é maior de idade.'
    )
  })
})
