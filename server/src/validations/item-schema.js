import { z } from 'zod'

export const itemSchema = z.object({
  category: z.string().max(50).min(1).trim(),
  condition: z.string().max(50).min(1).trim()
})
