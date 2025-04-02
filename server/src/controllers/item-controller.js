import StatusCodes from 'http-status-codes'

import { ErrorApplication } from '../utils/error-handler.js'
import { response } from '../utils/response.js'
import { ItemRepository } from '../repositories/item-repository.js'
import cloudinary from 'cloudinary'

export class ItemController {
  static async createItem (req, res) {
    const data = req.body
    try {
      const item = await ItemRepository.createItem(data)

      if (!item) {
        throw new ErrorApplication('Não foi possível criar artigo.', StatusCodes.BAD_REQUEST)
      }

      response(res, true, StatusCodes.OK, item)
    } catch (error) {
      if (error instanceof ErrorApplication) {
        response(res, false, error.statusCodes, error.message)
      } else {
        console.error('Internal error: ', error.message)
        response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao criar o artigo.')
      }
    }
  }

  static async updateSale (req, res) {
    const data = req.body
    try {
      const sale = await ItemRepository.updateSale(data)

      if (!sale) {
        throw new ErrorApplication('Não foi possível atualizar a venda', StatusCodes.BAD_REQUEST)
      }

      response(res, true, StatusCodes.OK, sale)
    } catch (error) {
      if (error instanceof ErrorApplication) {
        response(res, false, error.statusCodes, error.message)
      } else {
        console.error('Erro ao atualizar a venda: ', error.message)
        response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao atualizar a venda.')
      }
    }
  }

  static async getAllItems (req, res) {
    try {
      const items = await ItemRepository.getAllItems()

      response(res, true, StatusCodes.OK, items)
    } catch (error) {
      console.error('Erro ao obter vendas: ', error.message)
      response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao encontrar os items.')
    }
  }

  static async getItemById (req, res) {
    const { id } = req.params
    try {
      const item = await ItemRepository.getItemById(id)

      if (!item) {
        throw new ErrorApplication('Artigo não encontrado.', StatusCodes.NOT_FOUND)
      }

      response(res, true, StatusCodes.OK, item)
    } catch (error) {
      if (error instanceof ErrorApplication) {
        response(res, false, error.statusCodes, error.message)
      } else {
        console.error('Erro ao obter artigo: ', error.message)
        response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao encontrar o item.')
      }
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
        response(res, true, StatusCodes.OK, 'Imagem inserida.')
      }

      response(res, false, StatusCodes.BAD_REQUEST, 'Ocorreu um erro ao inserir a imagem.')
    } catch (error) {
      console.error('Erro ao inserir imagem:', error.message)
      response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao inserir a sua imagem. Tente mais tarde.')
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
          response(res, true, StatusCodes.OK, 'Imagem do artigo atualizada.')
        }

        response(res, false, StatusCodes.BAD_REQUEST, 'Ocorreu um erro ao atualizar a imagem.')
      }
    } catch (error) {
      console.error('Erro ao atualizar imagem:', error.message)
      response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Ocorreu um erro ao atualizar a sua imagem. Tente mais tarde.')
    }
  }
}
