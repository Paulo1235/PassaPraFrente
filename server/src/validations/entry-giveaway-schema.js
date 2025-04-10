import { z } from 'zod'

export const entryGiveawaySchema = z.object({
  entryDate: z.date({
    required_error: 'A data de inscrição é obrigatória',
    invalid_type_error: 'Formato de data inválido'
  })
})
