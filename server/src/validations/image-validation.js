import { z } from 'zod'

export const imageSchema = z.object({
  url: z.url()
})
