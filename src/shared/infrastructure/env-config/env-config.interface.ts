export interface IEnvConfig {
  getAppPort(): number
  getNodeEnv(): string
  getJwtSecret(): string
  getExpiresInSeconds(): number
}

export interface IEnv {
  PORT: number
  NODE_ENV: string
  JWT_SECRET: string
  EXPIRES_IN_SECONDS: number
}
