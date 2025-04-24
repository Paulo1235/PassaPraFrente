import { describe, it, expect, vi } from 'vitest'
import * as bcrypt from 'bcrypt'
import { hashPassword, comparePassword } from '../../src/utils/password.js'
import { SALT_ROUNDS } from '../../config.js'

vi.mock('bcrypt')

describe('hashPassword', () => {
  it('deve retornar a senha hasheada com sucesso', async () => {
    const mockHash = 'hashed_password'
    bcrypt.hash.mockResolvedValue(mockHash)

    const password = '123456'
    const hashedPassword = await hashPassword(password)

    expect(bcrypt.hash).toHaveBeenCalledWith(password, SALT_ROUNDS)
    expect(hashedPassword).toBe(mockHash)
  })
})

describe('comparePassword', () => {
  it('deve retornar true se as senhas coincidirem', async () => {
    const password = '123456'
    const hashedPassword = 'hashed_password'

    bcrypt.compare.mockResolvedValue(true)

    const result = await comparePassword(password, hashedPassword)

    expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword)
    expect(result).toBe(true)
  })

  it('deve retornar false se as senhas não coincidirem', async () => {
    const password = '123456'
    const hashedPassword = 'hashed_password'

    bcrypt.compare.mockResolvedValue(false)

    const result = await comparePassword(password, hashedPassword)

    expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword)
    expect(result).toBe(false)
  })
})
