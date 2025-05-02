import { PaginationInput } from "@/shared/application/dtos/pagination-input";
import { PaginationOutput, PaginationOutputMapper } from "@/shared/application/dtos/pagination-output";
import { BaseUseCase } from "@/shared/application/use-cases/base-use-case";
import { SearchParams, SearchResult } from "@/shared/domain/repositories/searchable.interface";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { IUserRepository } from "@/users/domain/repositories/user.repository-interface";
import { IUserOutput, UserOutputMapper } from "../dtos/user-output";



export namespace ListUsers {
  export type Input = PaginationInput

  export type Output = PaginationOutput<IUserOutput>

  export class UseCase implements BaseUseCase<Input, Output> {

    constructor(private readonly userRepository: IUserRepository.Repository) { }

    async execute(input: Input): Promise<Output> {
      const params = new SearchParams(input)
      const searchResult = await this.userRepository.search(params)
      return this.toOutput(searchResult);
    }

    private toOutput(searchResult: SearchResult<UserEntity>): Output {
      const items = searchResult.items.map(user => UserOutputMapper.toOutput(user));
      return PaginationOutputMapper.toOutput(items, searchResult)
    }
  }
}

