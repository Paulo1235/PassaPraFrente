import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'

import { response } from './response'

export const validateSchema = (schema, isPartial = false) => {
  return async (req, res, next) => {
    try {
      // POST (vai validar todos os dados) --> POST cria o recurso (schema completo)
      // PATCH (vai so validar os dados que fornecidos que ele quer atualizar) --> schema parcial
      const schemaToUse = isPartial ? schema.partial() : schema

      // fUNCAO QUE FACTO FAZ A VALIDACAO
      const result = schemaToUse.parse(req.body)

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
