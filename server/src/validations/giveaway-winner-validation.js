import { z } from 'zod'

export const giveawayWinnerSchema = z.object({
  nota: z.coerce.int().number().lte(5).gte(1)
})
