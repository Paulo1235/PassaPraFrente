import express from 'express'

import AuthController from '../controllers/auth-controller.js'
import AuthMiddleware from '../middlewares/auth-middleware.js'
import ProposalMiddleware from '../middlewares/owner-middleware.js'
import { giveawaySchema } from '../validations/giveaway-schema.js'
import { validateSchema } from '../utils/validate-schema.js'
import GiveawayController from '../controllers/giveaway-controller.js'
import { itemSchema } from '../validations/item-schema.js'

const giveawayRouter = express.Router()

giveawayRouter.post(
  '/giveaways/create',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.isAdult,
  validateSchema(giveawaySchema, false),
  validateSchema(itemSchema, false),
  GiveawayController.createGiveaway
)

giveawayRouter.get(
  '/giveaways/id/:id',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  GiveawayController.getGiveawayById
)

giveawayRouter.get(
  '/giveaways',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.authorizedRoles(['admin']),
  GiveawayController.getAllGiveaways
)

giveawayRouter.get(
  '/giveaways/available',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  GiveawayController.getAvailableGiveaways
)

giveawayRouter.get(
  '/giveaways/pending',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  GiveawayController.getPendingGiveaways
)

giveawayRouter.put(
  '/giveaways/id/:id',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  ProposalMiddleware.isOwnerGiveaway,
  validateSchema(giveawaySchema, true),
  validateSchema(itemSchema, true),
  GiveawayController.updateGiveaway
)

giveawayRouter.get(
  '/giveaways/user',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  GiveawayController.getUserGiveaways
)

giveawayRouter.patch(
  '/giveaways/update-status/:id',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.authorizedRoles(['admin']),
  GiveawayController.updateGiveawayStatus
)

giveawayRouter.patch(
  '/giveaways/update-image/:id',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  ProposalMiddleware.isOwnerGiveaway,
  GiveawayController.updateGiveawayImage
)

giveawayRouter.get(
  '/giveaways/non-completed',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  GiveawayController.getNonCompletedGiveawaysByUser
)

giveawayRouter.get(
  '/giveaways/completed',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  GiveawayController.getCompletedGiveawaysByUser
)

export default giveawayRouter
