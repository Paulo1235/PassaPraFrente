import express from 'express'

import AuthMiddleware from '../middlewares/auth-middleware.js'
import AuthController from '../controllers/auth-controller.js'
import EntryGiveawayController from '../controllers/entry-giveaway-controller.js'
import ProposalMiddleware from '../middlewares/owner-middleware.js'

const entryGiveawayRouter = express.Router()

entryGiveawayRouter.post(
  '/entry-giveaway/create/:giveawayId',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.isAdult,
  EntryGiveawayController.createEntryGiveaway
)

entryGiveawayRouter.get(
  '/entry-giveaway/giveaway/:giveawayId',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  EntryGiveawayController.getEntryGiveawayById
)

entryGiveawayRouter.get(
  '/entry-giveaway/user',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  EntryGiveawayController.getAllEntryGiveawaysByUserId
)

entryGiveawayRouter.get(
  '/entry-giveaway/giveaway/:giveawayId/all',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  ProposalMiddleware.isOwnerGiveaway,
  EntryGiveawayController.getAllEntryGiveawaysByGiveaway
)

export default entryGiveawayRouter
