import { z } from 'zod'

export const saleSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'O título é obrigatório e não pode estar vazio.' })
    .max(50, { message: 'O título deve ter no máximo 50 caracteres.' })
    .trim(),

  description: z
    .string()
    .min(10, { message: 'A descrição deve ter no mínimo 10 caracteres.' })
    .max(255, { message: 'A descrição deve ter no máximo 255 caracteres.' })
    .trim(),

  price: z
    .number()
    .gte(1, { message: 'O preço deve ser maior ou igual a 1.' })
})
