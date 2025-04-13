import { z } from 'zod'

export const reviewSchema = z.object({
  review: z.coerce
    .int()
    .number()
    .gte(1, { message: 'A avaliação deve ser no mínimo 1 estrela' })
    .lte(5, { message: 'A avaliação não pode ser superior a 5 estrelas' })
})
