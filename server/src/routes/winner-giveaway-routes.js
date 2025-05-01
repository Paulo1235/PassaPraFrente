import express from 'express'

import AuthMiddleware from '../middlewares/auth-middleware.js'
import WinnerGiveawayController from '../controllers/winner-giveaway-controller.js'
import OwnerMiddleware from '../middlewares/owner-middleware.js'
import { validateSchema } from '../utils/validate-schema.js'
import { reviewSchema } from '../validations/review-schema.js'

const winnerGiveawayRouter = express.Router()

winnerGiveawayRouter.post(
  '/winner-giveaway/create/:id',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  OwnerMiddleware.isOwnerGiveaway,
  AuthMiddleware.isAdult,
  WinnerGiveawayController.createWinnerGiveaway
)

winnerGiveawayRouter.get(
  '/winner-giveaway',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.authorizedRoles(['admin']),
  WinnerGiveawayController.getAllWinnersGiveaways
)

winnerGiveawayRouter.get(
  '/winner-giveaway/giveaway/:id',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  WinnerGiveawayController.getWinnerGiveawayById
)

winnerGiveawayRouter.get(
  '/winner-giveaway/user/:userId',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  WinnerGiveawayController.getAllWinnersGiveawaysByUserId
)

winnerGiveawayRouter.patch(
  '/winner-giveaway/review/:id',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  validateSchema(reviewSchema, false),
  WinnerGiveawayController.createReviewWinnerGiveaway
)

export default winnerGiveawayRouter
