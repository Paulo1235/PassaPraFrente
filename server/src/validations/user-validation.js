import { z } from 'zod'

export const userSchema = z.object({
  name: z.string().max(40).min(1).trim(),
  imageUrl: z.string().url(),
  contacto: z.string(22).startsWith('+'),
  dataNascimento: z.date()
})
