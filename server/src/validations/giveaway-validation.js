import { zod } from 'zod'

export const giveawaySchema = zod.object({
  titulo: zod.string().max(50).min(1).trim(),
  descricao: zod.string().min(10).max(255),
  dataInicio: zod.date(),
  dataFim: zod.date()
})
