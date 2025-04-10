import { z } from 'zod'

export const authSchema = z.object({
  email: z.string().email({ message: 'Endereço de e-mail inválido.' }),
  password: z
    .string()
    .min(6, { message: 'A palavra-passe deve ter pelo menos 6 caracteres.' }),
  confirmPassword: z.string()
})
