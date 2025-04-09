import cloudinary from 'cloudinary'

import { StatusCodes } from 'http-status-codes'
import { HttpException } from '../utils/error-handler.js'
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_NAME } from '../../config.js'

function configureCloudinary () {
  cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
  })
}

async function getCloudinaryFolders ({ cloudName, apiKey, apiSecret }) {
  if (!cloudName || !apiKey || !apiSecret) {
    throw new HttpException('Crendencias inválidas', StatusCodes.BAD_REQUEST)
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/folders`, {
      method: 'GET',
      credentials: 'include'
    }
  )

  if (!response.ok) {
    throw new HttpException('Ocorreu um erro ao obter as pastas', StatusCodes.INTERNAL_SERVER_ERROR)
  }

  const data = await response.json()

  return data
}

export { configureCloudinary, getCloudinaryFolders }
