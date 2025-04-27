import { describe, it, expect } from 'vitest'
import { saleSchema } from '../../src/validations/sale-schema.js'

describe('Validação do saleSchema', () => {
  it('deve validar um objeto de venda correto', () => {
    const vendaValida = {
      title: 'Produto Top',
      description: 'Descrição completa e detalhada do produto.',
      price: 100
    }

    const resultado = saleSchema.safeParse(vendaValida)
    expect(resultado.success).toBe(true)
  })

  it('deve falhar se o título estiver vazio', () => {
    const vendaInvalida = {
      title: '',
      description: 'Descrição válida',
      price: 50
    }

    const resultado = saleSchema.safeParse(vendaInvalida)
    expect(resultado.success).toBe(false)
    expect(resultado.error?.issues[0].message).toBe('O título é obrigatório e não pode estar vazio.')
  })

  it('deve falhar se o título tiver mais de 50 caracteres', () => {
    const vendaInvalida = {
      title: 'A'.repeat(51),
      description: 'Descrição válida',
      price: 50
    }

    const resultado = saleSchema.safeParse(vendaInvalida)
    expect(resultado.success).toBe(false)
    expect(resultado.error?.issues[0].message).toBe('O título deve ter no máximo 50 caracteres.')
  })

  it('deve falhar se a descrição tiver menos de 10 caracteres', () => {
    const vendaInvalida = {
      title: 'Produto',
      description: 'Curto',
      price: 50
    }

    const resultado = saleSchema.safeParse(vendaInvalida)
    expect(resultado.success).toBe(false)
    expect(resultado.error?.issues[0].message).toBe('A descrição deve ter no mínimo 10 caracteres.')
  })

  it('deve falhar se a descrição tiver mais de 255 caracteres', () => {
    const vendaInvalida = {
      title: 'Produto',
      description: 'A'.repeat(256),
      price: 50
    }

    const resultado = saleSchema.safeParse(vendaInvalida)
    expect(resultado.success).toBe(false)
    expect(resultado.error?.issues[0].message).toBe('A descrição deve ter no máximo 255 caracteres.')
  })

  it('deve falhar se o preço for inferior a 1', () => {
    const vendaInvalida = {
      title: 'Produto',
      description: 'Descrição válida',
      price: 0
    }

    const resultado = saleSchema.safeParse(vendaInvalida)
    expect(resultado.success).toBe(false)
    expect(resultado.error?.issues[0].message).toBe('O preço deve ser maior ou igual a 1.')
  })

  it('deve falhar se o preço não for um número', () => {
    const vendaInvalida = {
      title: 'Produto',
      description: 'Descrição válida',
      price: 'não é número'
    }

    const resultado = saleSchema.safeParse(vendaInvalida)
    expect(resultado.success).toBe(false)
    expect(resultado.error?.issues[0].message).toContain('Expected number')
  })
})
