import { z } from 'zod'

export const giveawaySchema = z.object({
  startDate: z.string().transform((val) => new Date(val)),
  endDate: z.string().transform((val) => new Date(val)),
  title: z.string(),
  description: z.string()
})
