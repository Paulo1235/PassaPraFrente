import { zod } from 'zod'

export const transactionSaleSchema = zod.object({
  valorFinal: zod.number().trim().gte(1),
  nota: zod.coerce.int().number().lte(5).gte(1)
})
