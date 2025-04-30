import { describe, it, expect, vi, beforeEach } from 'vitest'
import ItemController from '../../src/controllers/item-controller.js'
import ItemRepository from '../../src/repositories/item-repository.js'
import cloudinary from 'cloudinary'

vi.mock('../../src/repositories/item-repository.js')
vi.mock('cloudinary')

const thumbnailsMock = ['base64image1', 'base64image2']

describe('Criar Item', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve criar item e fazer upload de imagens', async () => {
    const data = {
      condition: 'Novo',
      category: 'Eletrônicos',
      thumbnails: thumbnailsMock
    }

    const createdItem = { Artigo_ID: 1 }
    const uploadedImage = { public_id: 'img1', secure_url: 'url1' }

    ItemRepository.createItem.mockResolvedValue(createdItem)

    ItemRepository.uploadItemPhoto.mockResolvedValue(true)

    cloudinary.v2.uploader.upload.mockResolvedValue(uploadedImage)

    const result = await ItemController.createItem(data)

    expect(result).toEqual(createdItem)
    expect(ItemRepository.uploadItemPhoto).toHaveBeenCalled()
  })

  it('deve lançar erro ao criar item', async () => {
    const data = { condition: 'Usado', category: 'Mobília', thumbnails: thumbnailsMock }

    ItemRepository.createItem.mockRejectedValue(new Error('Falha'))

    await expect(ItemController.createItem(data)).rejects.toThrow('Erro ao criar o artigo')
  })
})
