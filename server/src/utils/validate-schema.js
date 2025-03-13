import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'

import { response } from './response.js'

export const validateSchema = (schema, isPartial) => {
  return async (req, res, next) => {
    try {
      const schemaToUse = isPartial ? schema.partial() : schema

      const result = schemaToUse.parse(req.body)
      console.log(req.body)
      console.log(result)

      if (!result.success) {
        throw new z.ZodError(result.error.errors)
      }

      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        response(res, false, error.statusCodes || StatusCodes.BAD_REQUEST, error.errors)
      } else {
        response(res, false, StatusCodes.INTERNAL_SERVER_ERROR, 'Error validating')
      }
    }
  }
}
