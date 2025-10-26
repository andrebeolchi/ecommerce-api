import { RefreshTokenUseCase } from '~/domain/auth/application/use-cases/refresh-token-use-case'

import { errorHandler } from '~/adapters/controllers/interfaces/error-handler'
import { Request } from '~/adapters/controllers/interfaces/request'

import { Logger } from '~/infra/logger'

interface Headers {
  authorization: string
}

export class RefreshTokenController {
  constructor(
    private logger: Logger,
    private refreshUseCase: RefreshTokenUseCase
  ) {}

  async execute({ headers }: Request<undefined, undefined, Headers>) {
    try {
      const result = await this.refreshUseCase.execute(headers!.authorization!)

      return {
        status: 200,
        body: result,
      }
    } catch (error) {
      return errorHandler({ error, logger: this.logger })
    }
  }
}
