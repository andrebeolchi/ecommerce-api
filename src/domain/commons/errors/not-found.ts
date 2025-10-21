import { CustomError } from './custom'

export class NotFoundError extends CustomError {
  status = 404

  constructor(message: string) {
    super(message)
  }
}
