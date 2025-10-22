import { z } from 'zod'

export const getProductsByIdSchema = z.object({
  id: z.string().uuid(),
})

export type GetProductsByIdSchema = z.infer<typeof getProductsByIdSchema>
