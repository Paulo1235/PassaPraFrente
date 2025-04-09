import { z } from 'zod'

export const saleSchema = z.object({
  title: z
    .string()
    .min(1, 'O título é obrigatório e não pode estar vazio.')
    .max(50, 'O título deve ter no máximo 50 caracteres.')
    .trim(),
  description: z
    .string()
    .min(10, 'A descrição deve ter no mínimo 10 caracteres.')
    .max(255, 'A descrição deve ter no máximo 255 caracteres.'),

  price: z
    .number()
    .gte(1, 'O preço deve ser maior ou igual a 1.')
    .max(10000, 'O preço não pode ser maior que 10.000.')
})
