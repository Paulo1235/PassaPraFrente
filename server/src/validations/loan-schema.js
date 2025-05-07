import { z } from 'zod'
import convertUTCToLocalISOString from '../utils/date.js'

const today = new Date()
const localDate = new Date(convertUTCToLocalISOString(today))

const baseDateSchema = z.string()
  .refine(val => !isNaN(Date.parse(val)), {
    message: 'Data inválida'
  })
  .transform(val => new Date(convertUTCToLocalISOString(new Date(val))))

// Schema base com todos os campos em comum
const baseLoanSchema = z.object({
  title: z.string()
    .trim()
    .min(1, { message: 'O título é obrigatório' })
    .max(100, { message: 'O título deve ter no máximo 100 caracteres' }),

  description: z.string()
    .min(10, { message: 'A descrição deve ter pelo menos 10 caracteres' })
    .max(255, { message: 'A descrição deve ter no máximo 255 caracteres' }),

  price: z.number()
    .gte(1, { message: 'O preço deve ser no mínimo 1' }),

  startDate: baseDateSchema,
  endDate: baseDateSchema
})

export const createLoanSchema = baseLoanSchema.extend({
  startDate: baseDateSchema.refine(date => date > localDate, {
    message: 'A data de início deve ser futura'
  }),
  endDate: baseDateSchema.refine(date => date > localDate, {
    message: 'A data de fim deve ser futura'
  })
})

export const updateLoanSchema = baseLoanSchema
