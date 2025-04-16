import { describe, it, expect, vi, beforeEach } from 'vitest'
import NotificationController from '../../src/controllers/notification-controller.js'
import NotificationRepository from '../../src/repositories/notification-repository.js'
import response from '../../src/utils/response.js'
import { StatusCodes } from 'http-status-codes'

vi.mock('../../src/repositories/notification-repository.js', () => ({
  default: {
    getNotificationById: vi.fn(),
    getAllNotifications: vi.fn(),
    getUserNotifications: vi.fn()
  }
}))

vi.mock('../../src/utils/response.js', () => ({
  default: vi.fn()
}))

describe('NotificationGetController', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve retornar a notificação por ID', async () => {
    const req = { params: { id: '1' } }
    const res = {}
    const notification = { id: 1, message: 'Notificação 1' }

    NotificationRepository.getNotificationById.mockResolvedValue(notification)

    await NotificationController.getNotificationById(req, res)

    expect(response).toHaveBeenCalledWith(res, true, StatusCodes.OK, notification)
  })

  it('deve retornar erro se notificação não for encontrada', async () => {
    const req = { params: { id: '999' } }
    const res = {}

    NotificationRepository.getNotificationById.mockResolvedValue(null)

    await NotificationController.getNotificationById(req, res)

    expect(response).toHaveBeenCalledWith(res, false, StatusCodes.NOT_FOUND, 'Notificação não encontrada.')
  })

  it('deve retornar todas as notificações', async () => {
    const req = {}
    const res = {}
    const notifications = [{ id: 1, message: 'Notificação 1' }, { id: 2, message: 'Notificação 2' }]

    NotificationRepository.getAllNotifications.mockResolvedValue(notifications)

    await NotificationController.getAllNotifications(req, res)

    expect(response).toHaveBeenCalledWith(res, true, StatusCodes.OK, notifications)
  })
})
