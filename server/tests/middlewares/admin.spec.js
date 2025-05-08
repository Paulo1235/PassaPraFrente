import { describe, it, expect, vi, beforeEach } from 'vitest'
import AuthMiddleware from '../../src/middlewares/auth-middleware.js'
import UserRepository from '../../src/repositories/user-repository.js'
import response from '../../src/utils/response.js'
import { StatusCodes } from 'http-status-codes'

vi.mock('../../src/repositories/user-repository.js')
vi.mock('../../src/utils/response.js', () => ({
  default: vi.fn()
}))

const criaReqResNext = (userId) => ({
  req: { user: { Utilizador_ID: userId } },
  res: { status: vi.fn().mockReturnThis(), json: vi.fn() },
  next: vi.fn()
})

describe('Testes de cargos autorizados', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve permitir acesso se o papel for autorizado', async () => {
    const { req, res, next } = criaReqResNext(123)

    UserRepository.getUserRole.mockResolvedValue({ TipoUtilizador: 'admin' })

    const middleware = AuthMiddleware.authorizedRoles(['admin'])

    await middleware(req, res, next)

    expect(UserRepository.getUserRole).toHaveBeenCalledWith(123)

    expect(next).toHaveBeenCalled()

    expect(response).not.toHaveBeenCalled()
  })

  it('deve bloquear acesso se o cargo não for autorizado', async () => {
    const { req, res, next } = criaReqResNext(456)

    UserRepository.getUserRole.mockResolvedValue({ TipoUtilizador: 'user' })

    const middleware = AuthMiddleware.authorizedRoles(['admin'])

    await middleware(req, res, next)

    expect(UserRepository.getUserRole).toHaveBeenCalledWith(456)

    expect(next).not.toHaveBeenCalled()

    expect(response).toHaveBeenCalledWith(
      res,
      false,
      StatusCodes.UNAUTHORIZED,
      'Não está autorizado a executar esta operação.'
    )
  })
})
