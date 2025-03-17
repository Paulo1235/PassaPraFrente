import { z } from 'zod'

export const userSchema = z.object({
  name: z.string().max(40).min(1).trim(),
  imageUrl: z.string().url(),
  contact: z.string(22).startsWith('+'),
  birthDate: z.coerce.date()
})
