import express from 'express'
import NotificationController from '../controllers/notification-controller.js'
import AuthController from '../controllers/auth-controller.js'
import AuthMiddleware from '../middlewares/auth-middleware.js'

const notificationRouter = express.Router()

notificationRouter.post(
  '/notifications/create',
  NotificationController.createNotification
)

notificationRouter.get(
  '/notifications/id/:id',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  NotificationController.getNotificationById
)

notificationRouter.get(
  '/notifications',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.authorizedRoles(['admin']),
  NotificationController.getAllNotifications
)

notificationRouter.get(
  '/notifications/user',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  NotificationController.getUserNotifications
)

notificationRouter.patch(
  '/notifications/read/:id',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  NotificationController.markAsRead
)

export default notificationRouter
