import { describe, it, expect, vi } from 'vitest'
import cloudinary from 'cloudinary'
import { configureCloudinary } from '../../src/services/cloudinary-service.js'

global.fetch = vi.fn()

configureCloudinary()

describe('Testando integração com o Cloudinary', () => {
  it('deve fazer upload de uma imagem e retornar a URL correta', async () => {
    const imageBuffer = Buffer.from('image data')

    const response = cloudinary.v2.uploader.upload_stream((error, result) => {
      if (error) {
        throw new Error('Erro no upload')
      }

      expect(result).toHaveProperty('secure_url')
      expect(result.secure_url).toContain('https://res.cloudinary.com')
    })

    response.end(imageBuffer)
  })
})
