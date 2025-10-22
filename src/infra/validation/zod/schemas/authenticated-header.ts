import { z } from 'zod'

export const authenticatedHeaderSchema = z.object({
  authorization: z.string().regex(/^Bearer\s[\w-]*\.[\w-]*\.[\w-]*$/),
})

export type AuthenticatedHeaderSchema = z.infer<typeof authenticatedHeaderSchema>
