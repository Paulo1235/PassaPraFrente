import cron from 'node-cron'

import FileService from './file-service.js'
import { NOTIFICATION_EXPIRE_DAYS } from '../../config.js'

// Executa todos os dias à meia-noite
cron.schedule('0 0 * * *', async () => {
  try {
    const notifications = FileService.readFile()

    const daysAgo = new Date()
    daysAgo.setDate(daysAgo.getDate() - NOTIFICATION_EXPIRE_DAYS)

    const updatedNotifications = notifications.filter(notification => {
      const notificationDate = new Date(notification.date)

      return notificationDate >= daysAgo
    })

    FileService.writeFile(updatedNotifications)
  } catch (error) {
    console.error('Ocorreu um erro ao eliminar as notificações.')
  }
})
