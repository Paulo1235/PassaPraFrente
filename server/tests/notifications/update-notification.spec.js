import { describe, it, expect, vi, beforeEach } from 'vitest'
import NotificationController from '../../src/controllers/notification-controller.js'
import NotificationRepository from '../../src/repositories/notification-repository.js'
import response from '../../src/utils/response.js'
import { StatusCodes } from 'http-status-codes'

vi.mock('../../src/repositories/notification-repository.js', () => ({
  default: {
    getNotificationById: vi.fn(),
    markAsRead: vi.fn()
  }
}))

vi.mock('../../src/utils/response.js', () => ({
  default: vi.fn()
}))

describe('NotificationMarkReadController', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve marcar a notificação como lida com sucesso', async () => {
    const req = { user: { Utilizador_ID: 1 }, params: { id: 1 } }
    const res = {}
    const notification = { id: 1, userId: 1, message: 'Notificação 1' }

    NotificationRepository.getNotificationById.mockResolvedValue(notification)

    NotificationRepository.markAsRead.mockResolvedValue(true)

    await NotificationController.markAsRead(req, res)

    expect(NotificationRepository.markAsRead).toHaveBeenCalledWith(1)
    expect(response).toHaveBeenCalledWith(res, true, StatusCodes.OK, notification)
  })

  it('deve retornar erro se a notificação não for encontrada', async () => {
    const req = { user: { Utilizador_ID: 1 }, params: { id: 999 } }
    const res = {}

    NotificationRepository.getNotificationById.mockResolvedValue(null)

    await NotificationController.markAsRead(req, res)

    expect(response).toHaveBeenCalledWith(res, false, StatusCodes.NOT_FOUND, 'Notificação não encontrada.')
  })
})
