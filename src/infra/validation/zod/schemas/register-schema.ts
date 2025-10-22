import { z } from 'zod'

export const registerSchema = z.object({
  email: z.email(),
  password: z.string(),
})

export type RegisterSchema = z.infer<typeof registerSchema>
