import { zod } from 'zod'

export const entryGiveawaySchema = zod.object({
  dataInscricao: zod.date()
})
