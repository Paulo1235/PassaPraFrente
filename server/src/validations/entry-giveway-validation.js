import { zod } from 'zod'

const user = zod.object({
  dataInscricao: zod.date()
})
