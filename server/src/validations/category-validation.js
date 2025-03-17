import { zod } from 'zod'

export const categorySchema = zod.object({
  nomeCategoria: zod.string().max(20).min(1).trim()
})
