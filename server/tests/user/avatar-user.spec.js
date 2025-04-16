import { describe, it, expect, vi, beforeEach } from 'vitest'
import UserController from '../../src/controllers/user-controller.js'
import UserRepository from '../../src/repositories/user-repository.js'
import response from '../../src/utils/response.js'
import { StatusCodes } from 'http-status-codes'
import cloudinary from 'cloudinary'

vi.mock('../../src/repositories/user-repository.js', () => ({
  default: {
    uploadUserAvatar: vi.fn()
  }
}))

vi.mock('../../src/utils/response.js', () => ({
  default: vi.fn()
}))

vi.mock('cloudinary', () => ({
  v2: {
    uploader: {
      upload: vi.fn()
    }
  }
}))

describe('UserController.uploadUserAvatar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve fazer upload da imagem e responder com sucesso', async () => {
    const req = {
      user: { Utilizador_ID: 1 },
      body: { thumbnail: 'base64imagemaqui' }
    }
    const res = {}

    const mockUploadResult = {
      public_id: 'users/avatar123',
      url: 'https://cloudinary.com/avatar123.png'
    }

    cloudinary.v2.uploader.upload.mockResolvedValue(mockUploadResult)
    UserRepository.uploadUserAvatar.mockResolvedValue(true)

    await UserController.uploadUserAvatar(req, res)

    expect(cloudinary.v2.uploader.upload).toHaveBeenCalledWith('base64imagemaqui', {
      folder: 'users'
    })

    expect(UserRepository.uploadUserAvatar).toHaveBeenCalledWith(1, 'users/avatar123', 'https://cloudinary.com/avatar123.png')

    expect(response).toHaveBeenCalledWith(res, true, StatusCodes.OK, 'Imagem inserida.')
  })

  it('deve responder com erro se upload no banco falhar', async () => {
    const req = {
      user: { Utilizador_ID: 1 },
      body: { thumbnail: 'base64imagemaqui' }
    }
    const res = {}

    const mockUploadResult = {
      public_id: 'users/avatar123',
      url: 'https://cloudinary.com/avatar123.png'
    }

    cloudinary.v2.uploader.upload.mockResolvedValue(mockUploadResult)
    UserRepository.uploadUserAvatar.mockResolvedValue(false)

    await UserController.uploadUserAvatar(req, res)

    expect(response).toHaveBeenCalledWith(res, false, StatusCodes.BAD_REQUEST, 'Ocorreu um erro ao inserir a imagem.')
  })
})
