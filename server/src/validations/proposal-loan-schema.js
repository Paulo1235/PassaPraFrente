import { z } from 'zod'

export const proposalLoanSchema = z.object({
  newValue: z.number({
    required_error: 'O valor é obrigatório',
    invalid_type_error: 'O valor deve ser um número'
  }).gte(1, { message: 'O valor deve ser no mínimo 1' }),

  newStartDate: z.date({
    required_error: 'A nova data de início é obrigatória',
    invalid_type_error: 'Formato de data inválido'
  }),

  newEnd: z.date({
    required_error: 'A nova data de fim é obrigatória',
    invalid_type_error: 'Formato de data inválido'
  })
}).refine(data => data.newEnd > data.newStartDate, {
  path: ['newEnd'],
  message: 'A nova data de fim deve ser posterior à nova data de início'
})
