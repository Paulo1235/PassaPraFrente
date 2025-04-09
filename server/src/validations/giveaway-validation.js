import { z } from 'zod'

export const giveawaySchema = z.object({
  title: z.string().max(50).min(1).trim(),
  description: z.string().min(10).max(255),
  startDate: z.date(),
  endDate: z.date()
})
