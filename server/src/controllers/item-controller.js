import { StatusCodes } from 'http-status-codes'

import cloudinary from 'cloudinary'

import response from '../utils/response.js'
import { ItemRepository } from '../repositories/item-repository.js'
import { handleError, HttpException } from '../utils/error-handler.js'

class ItemController {
  static async createItem (req, res) {
    const data = req.body

    try {
      const item = await ItemRepository.createItem(data)

      if (!item) {
        throw new HttpException('Não foi possível criar artigo.', StatusCodes.BAD_REQUEST)
      }

      return response(res, true, StatusCodes.OK, item)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao criar o artigo.')
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

  static async uploadItemPhoto (req, res) {
    const id = req.user.Artigo_ID
    const { thumbnail } = req.body

    try {
      const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
        folder: 'items'
      })

      const uploadSuccess = await ItemRepository.uploadItemPhoto(id, myCloud.public_id, myCloud.url)

      if (uploadSuccess) {
        return response(res, true, StatusCodes.OK, 'Imagem inserida.')
      }

      return response(res, false, StatusCodes.BAD_REQUEST, 'Ocorreu um erro ao inserir a imagem.')
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao fazer upload da imagem.')
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
