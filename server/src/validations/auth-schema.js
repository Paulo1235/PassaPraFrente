import { z } from 'zod'

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  confirmPassword: z.string()
})
