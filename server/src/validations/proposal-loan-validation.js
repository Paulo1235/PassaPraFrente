import { zod } from 'zod'

const user = zod.object({
  novoValorFinal: zod.number().trim().gte(1),
  NovaDataInicioFinal: zod.date(),
  NovaDataFimFinal: zod.date(),
  aceite: zod.boolean()
})
