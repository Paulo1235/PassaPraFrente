import { describe, it, expect } from 'vitest'
import { authSchema } from '../../src/validations/auth-schema.js'

describe('authSchema', () => {
  it('deve retornar erro se o e-mail for inválido', () => {
    const invalidData = {
      email: 'invalid-email',
      password: 'password123',
      confirmPassword: 'password123'
    }

    const result = authSchema.safeParse(invalidData)

    expect(result.success).toBe(false)
    expect(result.error.issues[0].message).toBe('Endereço de e-mail inválido.')
  })

  it('deve retornar erro se a palavra-passe for menor que 6 caracteres', () => {
    const invalidData = {
      email: 'user@example.com',
      password: '123',
      confirmPassword: '123'
    }

    const result = authSchema.safeParse(invalidData)

    expect(result.success).toBe(false)
    expect(result.error.issues[0].message).toBe('A palavra-passe deve ter pelo menos 6 caracteres.')
  })

  it('deve retornar erro se a confirmação de palavra-passe for vazia', () => {
    const invalidData = {
      email: 'user@example.com',
      password: 'password123',
      confirmPassword: ''
    }

    const result = authSchema.safeParse(invalidData)

    expect(result.success).toBe(false)
    expect(result.error.issues[0].message).toBe('A confirmação da palavra-passe deve ter pelo menos 6 caracteres.')
  })

  it('deve passar se o e-mail, palavra-passe e confirmação estiverem corretos', () => {
    const validData = {
      email: 'user@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    }

    const result = authSchema.safeParse(validData)

    expect(result.success).toBe(true)
  })
})
