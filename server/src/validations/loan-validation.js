import { z } from 'zod'

export const loanSchema = z.object({
  title: z.string().max(100).min(1).trim(),
  description: z.string().min(10).max(255),
  price: z.number().gte(1),
  startDate: z.string().transform((val) => new Date(val)),
  endDate: z.string().transform((val) => new Date(val))
})
