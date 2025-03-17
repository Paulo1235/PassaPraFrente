import { zod } from 'zod'

export const proposalLoanSchema = zod.object({
  novoValorFinal: zod.number().trim().gte(1),
  NovaDataInicioFinal: zod.date(),
  NovaDataFimFinal: zod.date(),
  aceite: zod.boolean()
})
