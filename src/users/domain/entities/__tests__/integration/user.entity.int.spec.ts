import { userDateBuilder } from "@/users/domain/testing/helpers/user-data-builder"
import { UserEntity } from "../../user.entity"
import { EntityValidationError } from "@/shared/errors/validation-error"

describe('UserEntity Integration Tests', () => {
  describe('Constructor Method', () => {
    it('should throw EntityValidationError when name is empty', () => {
      const props = {
        ...userDateBuilder(),
        name: ''
      };
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)
    })

    it('should throw EntityValidationError when name is a number', () => {
      const props = {
        ...userDateBuilder(),
        name: 123 as any
      };
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)
    })

    it('should throw EntityValidationError when name is longer than 255 characters', () => {
      const props = {
        ...userDateBuilder(),
        name: 'a'.repeat(256)
      };
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)
    })

    it('should throw EntityValidationError when name is null', () => {
      const props = {
        ...userDateBuilder(),
        name: null as any
      };
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)
    })
  })
})
