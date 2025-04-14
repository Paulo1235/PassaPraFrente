import express from 'express'

import AuthController from '../controllers/auth-controller.js'
import AuthMiddleware from '../middlewares/auth-middleware.js'
import WinnerGiveawayController from '../controllers/winner-giveaway-controller.js'
import ProposalMiddleware from '../middlewares/owner-middleware.js'
import { validateSchema } from '../utils/validate-schema.js'
import { reviewSchema } from '../validations/review-schema.js'

const winnerGiveawayRouter = express.Router()

winnerGiveawayRouter.post(
  '/winner-giveaway/create/:id',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  ProposalMiddleware.isOwnerGiveaway,
  // ProposalMiddleware.isAdult,
  WinnerGiveawayController.createWinnerGiveaway
)

winnerGiveawayRouter.get(
  '/winner-giveaway',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.authorizedRoles(['admin']),
  WinnerGiveawayController.getAllWinnersGiveaways
)

winnerGiveawayRouter.get(
  '/winner-giveaway/giveaway/:id',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  WinnerGiveawayController.getWinnerGiveawayById
)

winnerGiveawayRouter.get(
  '/winner-giveaway/user/:userId',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  WinnerGiveawayController.getAllWinnersGiveawaysByUserId
)

winnerGiveawayRouter.patch(
  '/winner-giveaway/review/:id',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  validateSchema(reviewSchema, false),
  WinnerGiveawayController.createReviewWinnerGiveaway
)

export default winnerGiveawayRouter
