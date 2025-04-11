import express from 'express'

import AuthController from '../controllers/auth-controller.js'
import AuthMiddleware from '../middlewares/auth-middleware.js'
import WinnerGiveawayController from '../controllers/winner-giveaway-controller.js'
import ProposalMiddleware from '../middlewares/proposal-middleware.js'

const winnerGiveawayRouter = express.Router()

winnerGiveawayRouter.post(
  '/winner-giveaway/create/:giveawayId',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  ProposalMiddleware.isOwnerGiveaway,
  // ProposalMiddleware.isAdult,
  WinnerGiveawayController.createWinnerGiveaway
)

winnerGiveawayRouter.get(
  '/winner-giveaway/giveaway/:giveawayId',
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

export default winnerGiveawayRouter
