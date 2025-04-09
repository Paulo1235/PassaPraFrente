import Notification from '../entities/notification-entity.js'
import FileService from '../services/file-service.js'

class NotificationRepository {
  static createNotification (data) {
    const notification = new Notification(data)

    FileService.save(notification)

    return notification
  }

  static getNotificationById (id) {
    const notification = FileService.get(id)

    return notification
  }

  static getAllNotifications () {
    const notifications = FileService.getAll()

    return notifications
  }

  static getUserNotifications (userId) {
    const notifications = FileService.getAll()

    return notifications.filter(notification => notification.userId === userId)
  }

  static markAsRead (id) {
    const notification = FileService.get(id)

    notification.read = true

    FileService.save(notification)

    return notification
  }
}

export default NotificationRepository
