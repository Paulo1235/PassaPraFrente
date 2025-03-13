import { zod } from 'zod'

export const imageSchema = zod.object({
  url: zod.url()
})
