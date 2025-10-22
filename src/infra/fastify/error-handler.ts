import { FastifyReply, FastifyRequest } from 'fastify'

import { config } from '~/infra/config'

export const fastifyErrorHandler = (error: Error, req: FastifyRequest, reply: FastifyReply) => {
  if (config?.env === 'development') {
    console.error(error)
  }

  return reply.status(500).send([{ message: 'Internal server error' }])
}
