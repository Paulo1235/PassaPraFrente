import { describe, it, expect } from 'vitest'
import { itemSchema } from '../../src/validations/item-schema.js'

describe('itemSchema', () => {
  it('deve validar categoria e estado válidos', () => {
    const validData = {
      category: 'Roupas',
      condition: 'Novo',
      thumbnails: ['https://validimage.com/image1.jpg']
    }

    const result = itemSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('deve falhar quando a categoria for inválida', () => {
    const invalidData = {
      category: 'Comida',
      condition: 'Novo',
      thumbnails: ['https://validimage.com/image1.jpg']
    }

    const result = itemSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    expect(result.error.errors[0].message).toBe("Categoria inválida. Deve ser 'Roupas', 'Ferramentas', 'Eletrónicos', 'Brinquedos' ou 'Mobilia'")
  })

  it('deve falhar quando o estado for inválido', () => {
    const invalidData = {
      category: 'Roupas',
      condition: 'Velho',
      thumbnails: ['https://validimage.com/image1.jpg']
    }

    const result = itemSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    expect(result.error.errors[0].message).toBe("Estado inválido. Deve ser 'Novo', 'Quase Novo' ou 'Usado'")
  })

  it('deve validar URLs de imagens válidas', () => {
    const validData = {
      category: 'Roupas',
      condition: 'Novo',
      thumbnails: [
        'https://validimage.com/image1.jpg',
        'https://validimage.com/image2.jpg'
      ]
    }

    const result = itemSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('deve falhar se não houver pelo menos uma imagem', () => {
    const invalidData = {
      category: 'Roupas',
      condition: 'Novo',
      thumbnails: []
    }

    const result = itemSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    expect(result.error.errors[0].message).toBe('Deve ser fornecida pelo menos uma imagem.')
  })

  it('deve falhar se houver mais de 3 imagens', () => {
    const invalidData = {
      category: 'Roupas',
      condition: 'Novo',
      thumbnails: [
        'https://validimage.com/image1.jpg',
        'https://validimage.com/image2.jpg',
        'https://validimage.com/image3.jpg',
        'https://validimage.com/image4.jpg'
      ]
    }

    const result = itemSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    expect(result.error.errors[0].message).toBe('Não pode haver mais de 3 imagens.')
  })
})
