import { describe, it, expect } from 'vitest'
import { proposalLoanSchema } from '../../src/validations/proposal-loan-schema.js'

// Funções auxiliares para datas
const generateFutureDate = (daysAhead = 1) => {
  const date = new Date()
  date.setDate(date.getDate() + daysAhead)
  return date.toISOString()
}

const generatePastDate = (daysBehind = 1) => {
  const date = new Date()
  date.setDate(date.getDate() - daysBehind)
  return date.toISOString()
}

describe('Validação do proposalLoanSchema', () => {
  it('deve validar uma proposta correta', () => {
    const propostaValida = {
      price: 100,
      newStartDate: generateFutureDate(1),
      newEndDate: generateFutureDate(5)
    }

    const resultado = proposalLoanSchema.safeParse(propostaValida)
    expect(resultado.success).toBe(true)
  })

  it('deve validar uma proposta sem preço', () => {
    const propostaValida = {
      newStartDate: generateFutureDate(2),
      newEndDate: generateFutureDate(7)
    }

    const resultado = proposalLoanSchema.safeParse(propostaValida)
    expect(resultado.success).toBe(true)
  })

  it('deve falhar se o preço não for um número', () => {
    const propostaInvalida = {
      price: 'não é número',
      newStartDate: generateFutureDate(2),
      newEndDate: generateFutureDate(7)
    }

    const resultado = proposalLoanSchema.safeParse(propostaInvalida)
    expect(resultado.success).toBe(false)
    expect(resultado.error?.issues[0].message).toBe('O valor deve ser um número')
  })

  it('deve falhar se o preço for negativo', () => {
    const propostaInvalida = {
      price: -5,
      newStartDate: generateFutureDate(2),
      newEndDate: generateFutureDate(7)
    }

    const resultado = proposalLoanSchema.safeParse(propostaInvalida)
    expect(resultado.success).toBe(false)
    expect(resultado.error?.issues[0].message).toBe('O valor deve ser no mínimo 0')
  })

  it('deve falhar se a data de início for inválida', () => {
    const propostaInvalida = {
      price: 100,
      newStartDate: 'data-invalida',
      newEndDate: generateFutureDate(7)
    }

    const resultado = proposalLoanSchema.safeParse(propostaInvalida)
    expect(resultado.success).toBe(false)
    expect(resultado.error?.issues.some(issue => issue.message === 'Data de início inválida')).toBe(true)
  })

  it('deve falhar se a data de fim for inválida', () => {
    const propostaInvalida = {
      price: 100,
      newStartDate: generateFutureDate(2),
      newEndDate: 'data-invalida'
    }

    const resultado = proposalLoanSchema.safeParse(propostaInvalida)
    expect(resultado.success).toBe(false)
    expect(resultado.error?.issues.some(issue => issue.message === 'Data de fim inválida')).toBe(true)
  })

  it('deve falhar se a data de início não for futura', () => {
    const propostaInvalida = {
      price: 100,
      newStartDate: generatePastDate(1),
      newEndDate: generateFutureDate(7)
    }

    const resultado = proposalLoanSchema.safeParse(propostaInvalida)
    expect(resultado.success).toBe(false)
    expect(resultado.error?.issues.some(issue => issue.message === 'A data de início deve ser futura')).toBe(true)
  })

  it('deve falhar se a data de fim não for futura', () => {
    const propostaInvalida = {
      price: 100,
      newStartDate: generateFutureDate(2),
      newEndDate: generatePastDate(1)
    }

    const resultado = proposalLoanSchema.safeParse(propostaInvalida)
    expect(resultado.success).toBe(false)
    expect(resultado.error?.issues.some(issue => issue.message === 'A data de fim deve ser futura')).toBe(true)
  })

  it('deve falhar se a data de fim for antes da data de início', () => {
    const propostaInvalida = {
      price: 100,
      newStartDate: generateFutureDate(5),
      newEndDate: generateFutureDate(2)
    }

    const resultado = proposalLoanSchema.safeParse(propostaInvalida)
    expect(resultado.success).toBe(false)
    expect(resultado.error?.issues.some(issue => issue.message.includes('nova data de fim deve ser posterior'))).toBe(true)
  })
})
