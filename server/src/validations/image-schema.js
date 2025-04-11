import { z } from 'zod'

export const imageSchema = z.object({
  thumbnail: z.string()
    .url('O URL fornecido não é válido')
    // .regex(/\.(jpg|jpeg|png|gif|bmp|webp)$/i, {
    //   message: 'O URL deve apontar para uma imagem (extensão .jpg, .png, .gif, .bmp, .webp)'
    // })
    // .max(2048, 'A URL não pode ser maior que 2048 caracteres')
})
