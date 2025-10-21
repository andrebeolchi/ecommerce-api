export interface JwtProvider {
  generateToken(payload: Record<string, unknown>): Promise<string>
  verifyToken<T>(token: string): Promise<T | null>
}
