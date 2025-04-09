import { z } from 'zod'

export const saleSchema = z.object({
  title: z.string().max(50).min(1).trim(),
  description: z.string().min(10).max(255),
  price: z.number().gte(1)
})
