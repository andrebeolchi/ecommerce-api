import { z } from 'zod'

export const addToCartSchema = z.object({
  productId: z.uuid(),
  quantity: z.number().min(1),
})

export type AddToCartSchema = z.infer<typeof addToCartSchema>
