import { z } from 'zod'

export const userSchema = z.object({
  name: z.string()
    .min(1, { message: 'O nome é obrigatório e não pode estar vazio.' })
    .max(40, { message: 'O nome deve ter no máximo 40 caracteres.' })
    .trim(),

  contact: z.string()
    .length(22, { message: 'O número de contacto deve ter exatamente 22 caracteres.' })
    .startsWith('+', { message: 'O número de contacto deve começar com ' + '.' }),

  birthDate: z.coerce.date()
    .refine(date => date <= new Date(), {
      message: 'A data de nascimento não pode ser no futuro.'
    })
})
