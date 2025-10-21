import { CustomError } from './custom'

export class UnauthorizedError extends CustomError {
  status = 401

  constructor(message: string) {
    super(message)
  }
}
