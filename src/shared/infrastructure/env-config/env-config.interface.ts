export interface IEnvConfig {
  getAppPort(): number
  getNodeEnv(): string
}

export interface IEnv {
  PORT: number
  NODEENV: string
}
