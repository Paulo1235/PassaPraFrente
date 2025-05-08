import { describe, it, expect, vi, beforeEach } from 'vitest'
import NotificationController from '../../src/controllers/notification-controller'
import UserRepository from '../../src/repositories/user-repository'
import NotificationRepository from '../../src/repositories/notification-repository'

vi.mock('../../src/repositories/notification-repository.js', () => ({
  default: {
    createNotification: vi.fn()
  }
}))

vi.mock('../../src/repositories/user-repository.js', () => ({
  default: {
    getUserById: vi.fn()
  }
}))

describe('NotificationCreateController', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve criar uma notificação com sucesso', async () => {
    const notificationData = { userId: 1, message: 'Nova notificação' }
    const user = { id: 1 }

    UserRepository.getUserById.mockResolvedValue(user)

    NotificationRepository.createNotification.mockResolvedValue(true)

    const response = await NotificationController.createNotification(notificationData)

    expect(response).toBe(true)
  })

  it('não deve criar notificação se o utilizador não existir', async () => {
    const notificationData = { userId: 1, message: 'Nova notificação' }

    UserRepository.getUserById.mockResolvedValue(null)

    await NotificationController.createNotification(notificationData)

    expect(NotificationRepository.createNotification).not.toHaveBeenCalled()
  })
})
