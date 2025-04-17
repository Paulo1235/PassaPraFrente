import { StatusCodes } from 'http-status-codes'

import cloudinary from 'cloudinary'

import response from '../utils/response.js'
import ItemRepository from '../repositories/item-repository.js'
import { handleError, HttpException } from '../utils/error-handler.js'

class ItemController {
  static async createItem (data) {
    try {
      const item = await ItemRepository.createItem(data.condition, data.category)

      if (item) {
        await ItemController.uploadItemPhotos(item.Artigo_ID, data.thumbnails)
      }

      return item
    } catch (error) {
      throw new HttpException('Erro ao criar o artigo', StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }

  static async getAllItems (req, res) {
    try {
      const items = await ItemRepository.getAllItems()

      return response(res, true, StatusCodes.OK, items)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar os artigos.')
    }
  }

  static async getItemById (req, res) {
    const { id } = req.params

    try {
      const item = await ItemRepository.getItemById(id)

      if (!item) {
        throw new HttpException('Artigo não encontrado.', StatusCodes.NOT_FOUND)
      }

      return response(res, true, StatusCodes.OK, item)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar o artigo.')
    }
  }

  static async uploadItemPhotos (itemId, thumbnails) {
    const uploadedResults = []

    try {
      if (!thumbnails || !Array.isArray(thumbnails) || thumbnails.length === 0) {
        throw new HttpException('Deve enviar pelo menos uma imagem.', StatusCodes.BAD_REQUEST)
      }

      if (thumbnails.length > 3) {
        throw new HttpException('Deve ter no máximo 3 imagens.', StatusCodes.BAD_REQUEST)
      }

      for (const image of thumbnails) {
        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: 'items'
        })

        const uploadSuccess = await ItemRepository.uploadItemPhoto(itemId, myCloud.public_id, myCloud.url)

        if (uploadSuccess) {
          uploadedResults.push(myCloud.secure_url)
        }
      }

      return uploadedResults
    } catch (error) {
      throw new HttpException('Erro ao fazer upload das imagens', StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }

  static async updateItemPhoto (data) {
    const { index, thumbnail, itemId } = data

    try {
      const item = await ItemRepository.getItemById(itemId)

      if (!item) {
        throw new HttpException('Item não existe.', StatusCodes.NOT_FOUND)
      }

      const itemPhotos = await ItemRepository.getItemPhoto(itemId)

      const oldImage = itemPhotos[index]

      if (!oldImage) {
        throw new HttpException('Imagem não encontrada', StatusCodes.NOT_FOUND)
      }

      if (oldImage) {
        await cloudinary.v2.uploader.destroy(oldImage.PublicID)

        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: 'items',
          width: 123,
          height: 118
        })

        const updated = await ItemRepository.updateItemPhoto(itemId, myCloud.public_id, myCloud.secure_url)

        return updated
      }
    } catch (error) {
      throw new HttpException('Não foi possível atualizar a imagem do item', StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }

  static async replaceItemPhotos (itemId, newThumbnails) {
    const uploadedResults = []

    try {
      if (!newThumbnails || !Array.isArray(newThumbnails) || newThumbnails.length === 0) {
        throw new HttpException('Deve enviar pelo menos uma imagem.', StatusCodes.BAD_REQUEST)
      }

      if (newThumbnails.length > 3) {
        throw new HttpException('Deve ter no máximo 3 imagens.', StatusCodes.BAD_REQUEST)
      }

      // 1. Buscar imagens atuais
      const currentPhotos = await ItemRepository.getItemPhoto(itemId)

      for (const photo of currentPhotos) {
        await cloudinary.v2.uploader.destroy(photo.PublicID)
        await ItemRepository.deleteItemPhotoByPublicId(itemId, photo.PublicID)
      }

      // 3. Fazer upload das novas imagens
      for (const image of newThumbnails) {
        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: 'items'
        })

        const uploadSuccess = await ItemRepository.uploadItemPhoto(
          itemId,
          myCloud.public_id,
          myCloud.secure_url
        )

        if (uploadSuccess) {
          uploadedResults.push({
            public_id: myCloud.public_id,
            url: myCloud.secure_url
          })
        }
      }

      return uploadedResults
    } catch (error) {
      console.error(error)
      throw new HttpException('Erro ao substituir as imagens do item.', StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }
}

export default ItemController
