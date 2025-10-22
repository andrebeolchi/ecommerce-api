import { FastifyInstance } from 'fastify'

import { login } from './login'
import { register } from './register'

export async function authRoutes(app: FastifyInstance) {
  app.route({
    method: 'POST',
    url: '/api/auth/login',
    handler: login,
  })

  app.route({
    method: 'POST',
    url: '/api/auth/register',
    handler: register,
  })
}
