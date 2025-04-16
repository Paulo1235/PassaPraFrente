import { z } from 'zod'

import convertUTCToLocalISOString from '../utils/date.js'

const today = new Date()

const localDate = convertUTCToLocalISOString(today)

export const giveawaySchema = z.object({
  title: z.string()
    .trim()
    .min(1, { message: 'O título é obrigatório' })
    .max(100, { message: 'O título deve ter no máximo 100 caracteres' }),

  description: z.string()
    .min(10, { message: 'A descrição deve ter pelo menos 10 caracteres' })
    .max(255, { message: 'A descrição deve ter no máximo 255 caracteres' }),

  startDate: z.string()
    .refine(val => !isNaN(Date.parse(val)), {
      message: 'Data de início inválida'
    })
    .transform(val => {
      const date = new Date(val)
      const localDate = convertUTCToLocalISOString(date)
      return new Date(localDate)
    })
    .refine(date => {
      return date > new Date(localDate)
    }, {
      message: 'A data de início deve ser futura'
    }),

  endDate: z.string()
    .refine(val => !isNaN(Date.parse(val)), {
      message: 'Data de fim inválida'
    })
    .transform(val => {
      const date = new Date(val)
      const localDate = convertUTCToLocalISOString(date)
      return new Date(localDate)
    })
    .refine(date => {
      return date > new Date(localDate)
    }, {
      message: 'A data de fim deve ser futura'
    })
})
  .refine(data => {
    return data.endDate.getTime() > data.startDate.getTime()
  }, {
    message: 'A data de fim deve ser depois da data de início',
    path: ['endDate']
  })
