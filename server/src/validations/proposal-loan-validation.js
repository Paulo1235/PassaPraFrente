import { z } from 'zod'

export const proposalLoanSchema = z.object({
  novoValorFinal: z.number().trim().gte(1),
  NovaDataInicioFinal: z.date(),
  NovaDataFimFinal: z.date(),
  aceite: z.boolean()
})
