import { randomUUID } from 'node:crypto'
import { StatusCodes } from 'http-status-codes'

import NotificationRepository from '../repositories/notification-repository.js'
import { handleError, HttpException } from '../utils/error-handler.js'
import UserRepository from '../repositories/user-repository.js'
import response from '../utils/response.js'

class NotificationController {
  static async createNotification (req, res) {
    const data = req.body

    const id = randomUUID()

    const notification = {
      ...data,
      id
    }

    try {
      const user = await UserRepository.getUserById(data.userId)

      if (!user) {
        // Improve
        throw new HttpException('Utilizador não encontrado.', StatusCodes.NOT_FOUND)
      }

      await NotificationRepository.createNotification(notification)

      return response(res, true, StatusCodes.CREATED, 'Notificação criada com sucesso.')
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao criar a notificação. Tente novamente mais tarde.')
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
      handleError(res, error, 'Ocorreu um erro ao encontrar a notificação.')
    }
  }

  static async getAllNotifications (req, res) {
    try {
      const notifications = await NotificationRepository.getAllNotifications()

      return response(res, true, StatusCodes.OK, notifications)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar as notificações.')
    }
  }

  static async getUserNotifications (req, res) {
    const userId = req.user.Utilizador_ID

    try {
      const notifications = await NotificationRepository.getUserNotifications(userId)

      return response(res, true, StatusCodes.OK, notifications)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao encontrar as notificações do usuário.')
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

      if (userId !== notification.userId) {
        throw new HttpException('Utilizador não autorizado.', StatusCodes.UNAUTHORIZED)
      }

      await NotificationRepository.markAsRead(id)

      return response(res, true, StatusCodes.OK, notification)
    } catch (error) {
      handleError(res, error, 'Ocorreu um erro ao marcar a notificação como lida.')
    }
  }
}

export default NotificationController
