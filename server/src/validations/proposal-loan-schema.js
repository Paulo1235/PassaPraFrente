import { z } from 'zod'

export const proposalLoanSchema = z.object({
  newValue: z.number({
    invalid_type_error: 'O valor deve ser um número'
  }).gte(0, { message: 'O valor deve ser no mínimo 0' }).optional(),

  newStartDate: z.string({
    required_error: 'A nova data de início é obrigatória',
    invalid_type_error: 'Formato de data inválido'
  }).optional(),

  newEnd: z.string({
    required_error: 'A nova data de fim é obrigatória',
    invalid_type_error: 'Formato de data inválido'
  }).optional()
}).refine((data) => {
  if (data.newStartDate && data.newEnd) {
    return data.newEnd > data.newStartDate
  }
  return true // Se faltar algum dos dois, ignora a comparação
}, {
  path: ['newEnd'],
  message: 'A nova data de fim deve ser posterior à nova data de início'
})
