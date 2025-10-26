export interface JwtTokenPayload {
  userId: string
  email: string
}

export interface JwtProvider {
  generateToken(payload: JwtTokenPayload): Promise<string>
  verifyToken(token: string): Promise<JwtTokenPayload | null>
}
