import { zod } from 'zod'

const user = zod.object({
  url: zod.url()
})
