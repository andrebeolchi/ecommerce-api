import dotenv from 'dotenv'

dotenv.config()

interface Config {
  env: 'development' | 'production' | 'test'
  port: number | string
  jwt: {
    secret: string
  }
}

export const config: Config = {
  env: (process.env.NODE_ENV as Config['env']) ?? 'development',
  port: process.env.PORT ?? 3000,
  jwt: {
    secret: process.env.JWT_SECRET ?? 'your-secret-key',
  },
}
