import { zod } from 'zod'

export const userSchema = zod.object({
  name: zod.string().max(40).min(1).trim(),
  imageUrl: zod.url(),
  contacto: zod.startsWith('+').string(22),
  dataNascimento: zod.date()
})
