import { Logger } from '.'

export const mockLogger: Logger = {
  debug: console.debug,
  error: console.error,
  info: console.info,
  warn: console.warn,
}
