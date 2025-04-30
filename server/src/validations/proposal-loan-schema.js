import { z } from 'zod'
import convertUTCToLocalISOString from '../utils/date.js'

export const proposalLoanSchema = z.object({
  price: z.number({
    invalid_type_error: 'O valor deve ser um número'
  })
    .gte(0, { message: 'O valor deve ser no mínimo 0' })
    .optional(),

  newStartDate: z.string()
    .optional()
    .refine(val => !val || !isNaN(Date.parse(val)), {
      message: 'Data de início inválida'
    })
    .transform(val => {
      if (!val) return undefined
      const date = new Date(val)
      const localDate = convertUTCToLocalISOString(date)
      return new Date(localDate)
    })
    .refine(date => {
      if (!date) return true
      const localNow = new Date(convertUTCToLocalISOString(new Date()))
      return date > localNow
    }, {
      message: 'A data de início deve ser futura'
    }),

  newEndDate: z.string()
    .optional()
    .refine(val => !val || !isNaN(Date.parse(val)), {
      message: 'Data de fim inválida'
    })
    .transform(val => {
      if (!val) return undefined
      const date = new Date(val)
      const localDate = convertUTCToLocalISOString(date)
      return new Date(localDate)
    })
    .refine(date => {
      if (!date) return true
      const localNow = new Date(convertUTCToLocalISOString(new Date()))
      return date > localNow
    }, {
      message: 'A data de fim deve ser futura'
    })
})
  .refine(data => {
    const startDate = data.newStartDate
    const endDate = data.newEndDate

    if (startDate && endDate) {
      return endDate.getTime() > startDate.getTime()
    }

    return true
  }, {
    message: 'A nova data de fim deve ser posterior à nova data de início',
    path: ['newEndDate']
  })
