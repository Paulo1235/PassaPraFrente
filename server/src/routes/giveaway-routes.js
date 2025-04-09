import express from 'express'

import AuthController from '../controllers/auth-controller.js'
import AuthMiddleware from '../middlewares/auth-middleware.js'
import ProposalMiddleware from '../middlewares/proposal-middleware.js'
import { giveawaySchema } from '../validations/giveaway-validation.js'
import { validateSchema } from '../utils/validate-schema.js'
import GiveawayController from '../controllers/giveaway-controller.js'

const giveawayRouter = express.Router()

giveawayRouter.post(
  '/giveaways/create',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  // ProposalMiddleware.isAdult,
  validateSchema(giveawaySchema, false),
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

giveawayRouter.put(
  '/giveaways/id/:id',
  AuthController.refreshAccessToken,
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  ProposalMiddleware.isOwnerGiveaway,
  validateSchema(giveawaySchema, true),
  GiveawayController.updateGiveaway
)

export default giveawayRouter
