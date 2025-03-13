import { z } from 'zod'
import { StatusCodes } from 'http-status-codes'

import { response } from '../utils/response.js'

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string()
})

export const validateUser = async (req, res, next) => {
  try {
    const result = userSchema.parse(req.body)

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
