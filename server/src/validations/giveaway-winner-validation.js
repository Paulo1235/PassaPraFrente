import { zod } from 'zod'

export const giveawayWinnerSchema = zod.object({
  nota: zod.coerce.int().number().lte(5).gte(1)
})
