import { z } from 'zod'

export const transactionLoanSchema = z.object({
  finalValue: z.number({
    required_error: 'O valor final é obrigatório',
    invalid_type_error: 'O valor final deve ser um número'
  }).gte(1, { message: 'O valor final deve ser maior ou igual a 1' }),

  finalStartDate: z.date({
    required_error: 'A data de início é obrigatória',
    invalid_type_error: 'Formato de data de início inválido'
  }),

  finalEndDate: z.date({
    required_error: 'A data de fim é obrigatória',
    invalid_type_error: 'Formato de data de fim inválido'
  }),

  review: z.coerce
    .int()
    .number()
    .gte(1, { message: 'A avaliação deve ser no mínimo 1 estrela' })
    .lte(5, { message: 'A avaliação não pode ser superior a 5 estrelas' })
})
