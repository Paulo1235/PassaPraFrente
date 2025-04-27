import { z } from 'zod'

export const itemSchema = z.object({
  category: z.enum(['Roupas', 'Ferramentas', 'Eletrónicos', 'Brinquedos', 'Mobilia'], {
    errorMap: () => ({ message: "Categoria inválida. Deve ser 'Roupas', 'Ferramentas', 'Eletrónicos', 'Brinquedos' ou 'Mobilia'" })
  }),

  condition: z.enum(['Novo', 'Quase Novo', 'Usado'], {
    errorMap: () => ({ message: "Estado inválido. Deve ser 'Novo', 'Quase Novo' ou 'Usado'" })
  }),

  thumbnails: z
    .array(z.string().url(), {
      errorMap: () => ({ message: 'Cada imagem deve ser uma URL válida.' })
    })
    .min(1, { message: 'Deve ser fornecida pelo menos uma imagem.' })
    .max(3, { message: 'Não pode haver mais de 3 imagens.' })
})
