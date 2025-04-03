import { z } from 'zod'

export const transactionSaleSchema = z.object({
  valorFinal: z.number().trim().gte(1),
  nota: z.coerce.int().number().lte(5).gte(1)
})
