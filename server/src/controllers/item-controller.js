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

  static async updateItemPhoto (req, res) {
    const id = req.user.Utilizador_ID
    const { avatar } = req.body

    try {
      const itemPhotos = await ItemRepository.getItemPhoto(id)

      if (itemPhotos.public_id) {
        await cloudinary.v2.uploader.destroy(itemPhotos.public_id)

        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
          folder: 'items',
          width: 150
        })

        const updateSuccess = await ItemRepository.updateItemPhoto(id, myCloud.public_id, myCloud.secure_url)

        if (updateSuccess) {
          return response(res, true, StatusCodes.OK, 'Imagem do artigo atualizada.')
        }

        return response(res, false, StatusCodes.BAD_REQUEST, 'Ocorreu um erro ao atualizar a imagem.')
      }
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao atualizar a imagem.')
    }
  }
}

export default ItemController
