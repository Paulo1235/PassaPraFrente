import { z } from 'zod'

export const proposalSaleSchema = z.object({
  newValue: z.number().gte(1)
})
