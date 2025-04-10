import { z } from 'zod'

export const giveawaySchema = z.object({
  title: z.string().min(1, { message: 'O título é obrigatório' }),
  description: z.string().min(1, { message: 'A descrição é obrigatória' }),

  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Data de início inválida'
  }).transform((val) => new Date(val)),

  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Data de fim inválida'
  }).transform((val) => new Date(val))
}).refine((data) => data.endDate > data.startDate, {
  path: ['endDate'],
  message: 'A data de fim deve ser posterior à data de início'
})
