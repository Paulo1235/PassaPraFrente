import { z } from 'zod'

export const saleSchema = z.object({
  titulo: z.string().max(50).min(1).trim(),
  descricao: z.string().min(10).max(255),
  valor: z.number().gte(1)
})
