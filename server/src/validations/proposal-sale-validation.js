import { zod } from 'zod'

export const proposalSaleSchema = zod.object({
  novoValor: zod.number().trim().gte(1),
  aceite: zod.boolean()
})
