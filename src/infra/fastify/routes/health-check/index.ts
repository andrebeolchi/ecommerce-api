import { FastifyInstance } from 'fastify'

export async function healthCheckRoute(app: FastifyInstance) {
  app.route({
    method: 'GET',
    url: '/health',
    handler: async (_request, reply) => {
      return reply.status(200).send({ status: 'ok' })
    },
  })
}
