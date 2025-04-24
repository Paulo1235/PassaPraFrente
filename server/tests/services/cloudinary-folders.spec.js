import { describe, it, expect, vi } from 'vitest'
import { getCloudinaryFolders } from '../../src/services/cloudinary-service.js'
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_NAME } from '../../config.js'

global.fetch = vi.fn()

describe('getCloudinaryFolders', () => {
  it('deve devolver a lista de pastas do Cloudinary', async () => {
    const mockFolders = {
      folders: [
        { name: 'users', path: 'users' }
      ]
    }

    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockFolders)
    }

    fetch.mockResolvedValue(mockResponse)

    const result = await getCloudinaryFolders({
      cloudName: CLOUDINARY_NAME,
      apiKey: CLOUDINARY_API_KEY,
      apiSecret: CLOUDINARY_API_SECRET
    })

    expect(result).toEqual(mockFolders)
    expect(fetch).toHaveBeenCalledOnce()
  })

  it('deve devolver uma lista vazia se não houver pastas', async () => {
    const mockFolders = { folders: [] }

    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockFolders)
    }

    fetch.mockResolvedValue(mockResponse)

    const result = await getCloudinaryFolders({
      cloudName: CLOUDINARY_NAME,
      apiKey: CLOUDINARY_API_KEY,
      apiSecret: CLOUDINARY_API_SECRET
    })

    expect(result).toEqual(mockFolders)
  })

  it('deve lançar erro quando a resposta do Cloudinary falhar', async () => {
    const mockResponse = {
      ok: false,
      status: 500,
      json: vi.fn().mockResolvedValue({ message: 'Erro no servidor' })
    }

    fetch.mockResolvedValue(mockResponse)

    try {
      await getCloudinaryFolders({
        cloudName: CLOUDINARY_NAME,
        apiKey: CLOUDINARY_API_KEY,
        apiSecret: CLOUDINARY_API_SECRET
      })
    } catch (error) {
      expect(error.message).toBe('Ocorreu um erro ao obter as pastas')
    }
  })
})
