import { describe, it, expect, vi, beforeEach } from 'vitest'
import ItemController from '../../src/controllers/item-controller.js'
import ItemRepository from '../../src/repositories/item-repository.js'
import cloudinary from 'cloudinary'

vi.mock('../../src/repositories/item-repository.js')
vi.mock('cloudinary')

describe('Atualizar Fotos do Item', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve atualizar uma foto específica do item', async () => {
    const itemId = '1'
    const data = { itemId, index: 0, thumbnail: 'imageBase64' }

    const oldPhotos = [{ PublicID: 'oldImg', Url: 'url' }]
    const newUpload = { public_id: 'newImg', secure_url: 'newUrl' }

    ItemRepository.getItemById.mockResolvedValue({ Artigo_ID: itemId })

    ItemRepository.getItemPhoto.mockResolvedValue(oldPhotos)

    cloudinary.v2.uploader.destroy.mockResolvedValue()

    cloudinary.v2.uploader.upload.mockResolvedValue(newUpload)

    ItemRepository.updateItemPhoto.mockResolvedValue(true)

    const result = await ItemController.updateItemPhoto(data)
    expect(result).toBe(true)
    expect(cloudinary.v2.uploader.destroy).toHaveBeenCalledWith('oldImg')
    expect(ItemRepository.updateItemPhoto).toHaveBeenCalled()
  })
})
