import express from 'express'
import NotificationController from '../controllers/notification-controller.js'
import AuthMiddleware from '../middlewares/auth-middleware.js'

const notificationRouter = express.Router()

notificationRouter.get(
  '/notifications/id/:id',
  AuthMiddleware.isAuthenticated,
  NotificationController.getNotificationById
)

notificationRouter.get(
  '/notifications',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.authorizedRoles(['admin']),
  NotificationController.getAllNotifications
)

notificationRouter.get(
  '/notifications/user',
  AuthMiddleware.isAuthenticated,
  NotificationController.getUserNotifications
)

notificationRouter.patch(
  '/notifications/read/:id',
  AuthMiddleware.isAuthenticated,
  NotificationController.markAsRead
)

export default notificationRouter
