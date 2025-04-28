export namespace SignupUseCase {
  interface Input {
    name: string;
    email: string;
    password: string;
  }

  interface Output {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
  }

  export class UseCase {
    async execute(input: Input): Promise<Output> {
      throw new Error("Method not implemented")
    }
  }
}

