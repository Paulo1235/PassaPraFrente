import express from 'express'

import AuthMiddleware from '../middlewares/auth-middleware.js'
import OwnerMiddleware from '../middlewares/owner-middleware.js'
import { giveawaySchema } from '../validations/giveaway-schema.js'
import { validateSchema } from '../utils/validate-schema.js'
import GiveawayController from '../controllers/giveaway-controller.js'
import { itemSchema } from '../validations/item-schema.js'

const giveawayRouter = express.Router()

giveawayRouter.post(
  '/giveaways/create',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.isAdult,
  validateSchema(giveawaySchema, false),
  validateSchema(itemSchema, false),
  GiveawayController.createGiveaway
)

giveawayRouter.get(
  '/giveaways/id/:id',
  AuthMiddleware.isAuthenticated,
  GiveawayController.getGiveawayById
)

giveawayRouter.get(
  '/giveaways',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.authorizedRoles(['admin']),
  GiveawayController.getAllGiveaways
)

giveawayRouter.get(
  '/giveaways/available',
  AuthMiddleware.isAuthenticated,
  GiveawayController.getAvailableGiveaways
)

giveawayRouter.get(
  '/giveaways/pending',
  AuthMiddleware.isAuthenticated,
  GiveawayController.getPendingGiveaways
)

giveawayRouter.put(
  '/giveaways/id/:id',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  OwnerMiddleware.isOwnerGiveaway,
  validateSchema(giveawaySchema, true),
  validateSchema(itemSchema, true),
  GiveawayController.updateGiveaway
)

giveawayRouter.get(
  '/giveaways/user',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  GiveawayController.getUserGiveaways
)

giveawayRouter.patch(
  '/giveaways/update-status/:id',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  AuthMiddleware.authorizedRoles(['admin']),
  GiveawayController.updateGiveawayStatus
)

giveawayRouter.get(
  '/giveaways/non-completed',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  GiveawayController.getNonCompletedGiveawaysByUser
)

giveawayRouter.get(
  '/giveaways/completed',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isVerified,
  GiveawayController.getCompletedGiveawaysByUser
)

export default giveawayRouter
