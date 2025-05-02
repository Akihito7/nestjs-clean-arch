import { UserEntity } from "@/users/domain/entities/user.entity"
import { userDateBuilder } from "@/users/domain/testing/helpers/user-data-builder"
import { UserOutputMapper } from "../../user-output"

describe('UserOutput unit tests', () => {
  it("should map UserEntity to output DTO using toJson", () => {
    const userEntity = new UserEntity(userDateBuilder());
    const spyOnToJson = jest.spyOn(userEntity, 'toJson')
    const result = UserOutputMapper.toOutput(userEntity);
    expect(spyOnToJson).toHaveBeenCalledTimes(1)
    expect(result).toStrictEqual(userEntity.toJson())
  })
})