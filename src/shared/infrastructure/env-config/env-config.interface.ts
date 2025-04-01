export interface IEnvConfig {
  getAppPort(): number
  getNodeEnv(): string
}

export interface IEnv {
  PORT: number
  NODE_ENV: string
}
