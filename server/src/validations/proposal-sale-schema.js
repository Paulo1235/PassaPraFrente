import { z } from 'zod'

export const proposalSaleSchema = z.object({
  newValue: z.number({
    invalid_type_error: 'O valor deve ser um número'
  }).gte(0, { message: 'O valor deve ser no mínimo 0' }).optional()
})
