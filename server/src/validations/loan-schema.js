import { z } from 'zod'

export const loanSchema = z.object({
  title: z.string()
    .trim()
    .min(1, { message: 'O título é obrigatório' })
    .max(100, { message: 'O título deve ter no máximo 100 caracteres' }),

  description: z.string()
    .min(10, { message: 'A descrição deve ter pelo menos 10 caracteres' })
    .max(255, { message: 'A descrição deve ter no máximo 255 caracteres' }),

  price: z.number()
    .gte(1, { message: 'O preço deve ser no mínimo 1' }),

  startDate: z.string()
    .refine(val => !isNaN(Date.parse(val)), {
      message: 'Data de início inválida'
    })
    .transform(val => new Date(val)),

  endDate: z.string()
    .refine(val => !isNaN(Date.parse(val)), {
      message: 'Data de fim inválida'
    })
    .transform(val => new Date(val))
})
