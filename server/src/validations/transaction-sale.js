import { z } from 'zod'

export const transactionSaleSchema = z.object({
  valorFinal: z.number().gte(1),
  nota: z.number().int().lte(5).gte(1)
})
