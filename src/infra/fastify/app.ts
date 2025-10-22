import fastify from 'fastify'

import { config } from '~/infra/config'

import { authRoutes } from './routes/auth'
import { healthCheckRoute } from './routes/health-check'

const envToLogger = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  production: true,
  test: false,
}

export const app = fastify({
  logger: envToLogger[config.env] ?? true,
})

app.register(healthCheckRoute)
app.register(authRoutes)
