import { z } from 'zod'

export const entryGiveawaySchema = z.object({
  dataInscricao: z.date()
})
