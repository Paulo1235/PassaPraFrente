import { z } from 'zod'

export const transactionSaleSchema = z.object({
  finalValue: z
    .number({
      required_error: 'O valor final é obrigatório',
      invalid_type_error: 'O valor final deve ser um número'
    })
    .gte(1, { message: 'O valor final deve ser maior ou igual a 1' }),

  stars: z
    .number({
      required_error: 'A avaliação é obrigatória',
      invalid_type_error: 'A avaliação deve ser um número inteiro'
    })
    .int({ message: 'A avaliação deve ser um número inteiro' })
    .gte(1, { message: 'A avaliação deve ser no mínimo 1 estrela' })
    .lte(5, { message: 'A avaliação não pode ser superior a 5 estrelas' })
})
