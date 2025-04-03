import { z } from 'zod'

export const categorySchema = z.object({
  nomeCategoria: z.string().max(20).min(1).trim()
})
