import { RegisterUseCase } from '~/domain/auth/application/use-cases/register-use-case'

import { errorHandler } from '~/adapters/controllers/interfaces/error-handler'
import { Request } from '~/adapters/controllers/interfaces/request'
import { SchemaValidator } from '~/adapters/controllers/interfaces/schema-validator'

import { Logger } from '~/infra/logger'

export interface Body {
  email: string
  password: string
}

export class RegisterController {
  constructor(
    private logger: Logger,
    private registerUseCase: RegisterUseCase,
    private schemaValidator: SchemaValidator<Body>
  ) {}

  async execute({ body }: Request<Body>) {
    try {
      const { data, errors } = this.schemaValidator.execute(body!)

      if (errors.length) {
        return {
          status: 400,
          body: errors,
        }
      }

      const result = await this.registerUseCase.execute({ email: data.email, password: data.password })

      return {
        status: 201,
        body: result,
      }
    } catch (error) {
      return errorHandler({ error, logger: this.logger })
    }
  }
}
