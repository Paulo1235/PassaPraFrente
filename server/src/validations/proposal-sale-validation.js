import { zod } from 'zod'

const user = zod.object({
  novoValor: zod.number().trim().gte(1),
  aceite: zod.boolean()
})
