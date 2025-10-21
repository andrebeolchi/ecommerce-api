import dotenv from 'dotenv'

dotenv.config()

interface Config {
  env: 'development' | 'production' | 'test'
}

export const config: Config = {
  env: (process.env.NODE_ENV as Config['env']) ?? 'development',
}
