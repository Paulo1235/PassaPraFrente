import { z } from 'zod'

export const giveawaySchema = z.object({
  titulo: z.string().max(50).min(1).trim(),
  descricao: z.string().min(10).max(255),
  dataInicio: z.date(),
  dataFim: z.date()
})
