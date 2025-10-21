import { CustomError } from './custom'

export class ConflictError extends CustomError {
  status = 409

  constructor(message: string) {
    super(message)
  }
}
