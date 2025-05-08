import { StatusCodes } from 'http-status-codes'

import NotificationRepository from '../repositories/notification-repository.js'
import UserRepository from '../repositories/user-repository.js'
import { handleError, HttpException } from '../utils/error-handler.js'
import response from '../utils/response.js'

class NotificationController {
  static async createNotification (notificationData) {
    try {
      const user = await UserRepository.getUserById(notificationData.userId)

      if (!user) {
        throw new HttpException('Utilizador não encontrado.', StatusCodes.NOT_FOUND)
      }

      await NotificationRepository.createNotification(notificationData)

      return true
    } catch (error) {
      console.error('Erro ao criar notificação:', error)
    }
  }

  static async getNotificationById (req, res) {
    const { id } = req.params

    try {
      const notification = await NotificationRepository.getNotificationById(id)

      if (!notification) {
        throw new HttpException('Notificação não encontrada.', StatusCodes.NOT_FOUND)
      }

      return response(res, true, StatusCodes.OK, notification)
    } catch (error) {
      handleError(res, error, 'Erro ao encontrar notificação.')
    }
  }

  static async getAllNotifications (req, res) {
    try {
      const notifications = await NotificationRepository.getAllNotifications()
      return response(res, true, StatusCodes.OK, notifications)
    } catch (error) {
      handleError(res, error, 'Erro ao encontrar todas as notificações.')
    }
  }

  static async getUserNotifications (req, res) {
    const userId = req.user.Utilizador_ID

    try {
      const notifications = await NotificationRepository.getUserNotifications(userId)

      notifications.sort((a, b) => new Date(b.Data) - new Date(a.Data))

      return response(res, true, StatusCodes.OK, notifications)
    } catch (error) {
      handleError(res, error, 'Erro ao encontrar notificações do utilizador.')
    }
  }

  static async markAsRead (req, res) {
    const userId = req.user.Utilizador_ID
    const { id } = req.params

    try {
      const notification = await NotificationRepository.getNotificationById(id)

      if (!notification) {
        throw new HttpException('Notificação não encontrada.', StatusCodes.NOT_FOUND)
      }

      if (userId !== notification.Utilizador_ID) {
        throw new HttpException('Utilizador não autorizado.', StatusCodes.UNAUTHORIZED)
      }

      await NotificationRepository.markAsRead(id)

      return response(res, true, StatusCodes.OK, 'Notificação marcada como lida.')
    } catch (error) {
      handleError(res, error, 'Erro ao marcar notificação como lida.')
    }
  }
}

export default NotificationController
