import { z } from 'zod'

export const transactionLoanSchema = z.object({
  valorFinal: z.number().trim().gte(1),
  dataInicioFinal: z.date(),
  dataFimFinal: z.date(),
  nota: z.coerce.int().number().lte(5).gte(1)
})
