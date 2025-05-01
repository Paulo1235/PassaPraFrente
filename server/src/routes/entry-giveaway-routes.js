import express from 'express'

import AuthMiddleware from '../middlewares/auth-middleware.js'
import EntryGiveawayController from '../controllers/entry-giveaway-controller.js'
import OwnerMiddleware from '../middlewares/owner-middleware.js'

const entryGiveawayRouter = express.Router()

entryGiveawayRouter.post(
  '/entry-giveaway/create/:giveawayId',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.isAdult,
  EntryGiveawayController.createEntryGiveaway
)

entryGiveawayRouter.get(
  '/entry-giveaway/giveaway/:giveawayId',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  EntryGiveawayController.getEntryGiveawayById
)

entryGiveawayRouter.get(
  '/entry-giveaway/user',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  EntryGiveawayController.getAllEntryGiveawaysByUserId
)

entryGiveawayRouter.get(
  '/entry-giveaway/giveaway/:giveawayId/all',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  OwnerMiddleware.isOwnerGiveaway,
  EntryGiveawayController.getAllEntryGiveawaysByGiveaway
)

export default entryGiveawayRouter
