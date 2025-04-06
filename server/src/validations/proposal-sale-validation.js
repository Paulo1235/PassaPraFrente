import { z } from 'zod'

export const proposalSaleSchema = z.object({
  novoValor: z.number().gte(1),
  aceite: z.boolean()
})
