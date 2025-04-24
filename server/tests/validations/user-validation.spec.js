import { describe, it, expect } from 'vitest'
import { userSchema } from '../../src/validations/user-schema.js'

describe('userSchema Validation', () => {
  it('deve validar nome corretamente', () => {
    const validData = {
      name: 'João Silva',
      contact: '+351912345678',
      birthDate: '1990-01-01'
    }

    const result = userSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('deve retornar erro se o nome for vazio ou muito longo', () => {
    const invalidData = {
      name: '',
      contact: '+351912345678',
      birthDate: '1990-01-01'
    }
    const result = userSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    expect(result.error.issues[0].message).toBe('O nome é obrigatório e não pode estar vazio.')

    invalidData.name = 'João Silva Muito Longo Exemplo de Nome Que Passa de Quarenta Caracteres'
    const result2 = userSchema.safeParse(invalidData)
    expect(result2.success).toBe(false)
    expect(result2.error.issues[0].message).toBe('O nome deve ter no máximo 40 caracteres.')
  })

  it('deve validar o número de contato corretamente', () => {
    const validData = {
      name: 'João Silva',
      contact: '+351912345678',
      birthDate: '1990-01-01'
    }

    const result = userSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('deve validar a data de nascimento', () => {
    const validData = {
      name: 'João Silva',
      contact: '+351912345678',
      birthDate: '1990-01-01'
    }

    const result = userSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('deve retornar erro se a data de nascimento for no futuro', () => {
    const futureDate = new Date(Date.now() + 1000000)
    futureDate.setHours(futureDate.getHours() + 1)

    const invalidData = {
      name: 'João Silva',
      contact: '+351912345678',
      birthDate: futureDate.toISOString()
    }

    const currentDate = new Date()
    currentDate.setHours(currentDate.getHours() + 1)

    const result = userSchema.safeParse(invalidData)

    expect(result.success).toBe(false)
    expect(result.error.issues[0].message).toBe('A data de nascimento não pode ser no futuro.')
  })
})
