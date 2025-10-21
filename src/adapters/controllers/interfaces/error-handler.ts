import { CustomError } from '~/domain/commons/errors/custom'

import { config } from '~/infra/config'
import { Logger } from '~/infra/logger'

export function errorHandler({ error, logger }: { error: unknown; logger?: Logger }) {
  if (config.env === 'development') {
    console.error(error)
  }

  if (error instanceof CustomError) {
    logger?.warn(error.message, { error })
    return {
      body: [{ message: error.message }],
      status: error.status || 400,
    }
  }

  logger?.error('internal server error', { error })
  return {
    body: [{ message: 'Internal server error' }],
    status: 500,
  }
}
