export interface SchemaValidatorErrors {
  message: string
  path?: string
}

export interface SchemaValidator<T, O = T> {
  execute(data: T): { data: O; errors: SchemaValidatorErrors[] }
}
