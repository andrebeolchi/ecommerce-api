export interface Request<Body = undefined, Params = undefined, Headers = undefined, Query = undefined> {
  body?: Body
  params?: Params
  headers?: Headers
  query?: Query
}
