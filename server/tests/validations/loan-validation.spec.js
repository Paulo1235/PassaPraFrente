import { describe, it, expect } from 'vitest'
import { loanSchema } from '../../src/validations/loan-schema.js'

// Função para gerar datas futuras
const generateFutureDate = (daysAhead = 1) => {
  const date = new Date()
  date.setDate(date.getDate() + daysAhead)
  return date.toISOString()
}

// Função para gerar datas passadas
const generatePastDate = (daysBehind = 1) => {
  const date = new Date()
  date.setDate(date.getDate() - daysBehind)
  return date.toISOString()
}

describe('Validação do loanSchema', () => {
  it('deve validar um objeto de empréstimo correto', () => {
    const emprestimoValido = {
      title: 'Empréstimo de livro',
      description: 'Um livro muito interessante para emprestar.',
      price: 10,
      startDate: generateFutureDate(1),
      endDate: generateFutureDate(10)
    }

    const resultado = loanSchema.safeParse(emprestimoValido)
    expect(resultado.success).toBe(true)
  })

  it('deve falhar se a descrição tiver mais de 255 caracteres', () => {
    const emprestimoInvalido = {
      title: 'Título válido',
      description: 'A'.repeat(256),
      price: 10,
      startDate: generateFutureDate(1),
      endDate: generateFutureDate(10)
    }

    const resultado = loanSchema.safeParse(emprestimoInvalido)
    expect(resultado.success).toBe(false)
    expect(resultado.error?.issues[0].message).toBe('A descrição deve ter no máximo 255 caracteres')
  })

  it('deve falhar se o preço for inferior a 1', () => {
    const emprestimoInvalido = {
      title: 'Título válido',
      description: 'Descrição válida',
      price: 0,
      startDate: generateFutureDate(1),
      endDate: generateFutureDate(10)
    }

    const resultado = loanSchema.safeParse(emprestimoInvalido)
    expect(resultado.success).toBe(false)
    expect(resultado.error?.issues[0].message).toBe('O preço deve ser no mínimo 1')
  })

  it('deve falhar se a data de início for inválida', () => {
    const emprestimoInvalido = {
      title: 'Título válido',
      description: 'Descrição válida',
      price: 10,
      startDate: 'data-invalida',
      endDate: generateFutureDate(10)
    }

    const resultado = loanSchema.safeParse(emprestimoInvalido)
    expect(resultado.success).toBe(false)
    expect(resultado.error?.issues[0].message).toBe('Data de início inválida')
  })

  it('deve falhar se a data de fim for inválida', () => {
    const emprestimoInvalido = {
      title: 'Título válido',
      description: 'Descrição válida',
      price: 10,
      startDate: generateFutureDate(1),
      endDate: 'data-invalida'
    }

    const resultado = loanSchema.safeParse(emprestimoInvalido)
    expect(resultado.success).toBe(false)
    expect(resultado.error?.issues[0].message).toBe('Data de fim inválida')
  })

  it('deve falhar se a data de início não for futura', () => {
    const emprestimoInvalido = {
      title: 'Título válido',
      description: 'Descrição válida',
      price: 10,
      startDate: generatePastDate(1),
      endDate: generateFutureDate(10)
    }

    const resultado = loanSchema.safeParse(emprestimoInvalido)
    expect(resultado.success).toBe(false)
    expect(resultado.error?.issues.some(issue => issue.message === 'A data de início deve ser futura')).toBe(true)
  })

  it('deve falhar se a data de fim não for futura', () => {
    const emprestimoInvalido = {
      title: 'Título válido',
      description: 'Descrição válida',
      price: 10,
      startDate: generateFutureDate(1),
      endDate: generatePastDate(1)
    }

    const resultado = loanSchema.safeParse(emprestimoInvalido)
    expect(resultado.success).toBe(false)
    expect(resultado.error?.issues.some(issue => issue.message === 'A data de fim deve ser futura')).toBe(true)
  })
})
