import { zod } from 'zod'

export const saleSchema = zod.object({
  titulo: zod.string().max(50).min(1).trim(),
  descricao: zod.string().min(10).max(255),
  valor: zod.number().trim().gte(1)
})
