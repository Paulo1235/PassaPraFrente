import { z } from 'zod'

export const proposalSaleSchema = z.object({
  newValue: z.number({
    required_error: 'O valor é obrigatório',
    invalid_type_error: 'O valor deve ser um número'
  }).gte(1, { message: 'O valor deve ser no mínimo 1' })
})
