import { z } from 'zod'

export const itemSchema = z.object({
  category: z.enum(['Roupas', 'Ferramentas', 'Eletrónicos'], {
    errorMap: () => ({ message: "Categoria inválida. Deve ser 'Roupas', 'Ferramentas' ou 'Eletrónicos'" })
  }),

  condition: z.enum(['Novo', 'Quase Novo', 'Usado'], {
    errorMap: () => ({ message: "Estado inválido. Deve ser 'Novo', 'Quase Novo' ou 'Usado'" })
  })
})
