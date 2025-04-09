import { StatusCodes } from 'http-status-codes'

export const validateSchema = (schema, isPartial) => (req, res, next) => {
  const schemaToUse = isPartial ? schema.partial() : schema
  const result = schemaToUse.safeParse(req.body)

  if (!result.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      errors: result.error.errors.map((error) => ({
        field: error.path[0],
        message: error.message
      }))
    })
  }

  next()
}
