import { zod } from 'zod'

const user = zod.object({
  valorFinal: zod.number().trim().gte(1),
  dataInicioFinal: zod.date(),
  dataFimFinal: zod.date(),
  nota: zod.coerce.int().number().lte(5).gte(1)
})
