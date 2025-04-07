import { userDateBuilder } from "@/users/domain/testing/helpers/user-data-builder"
import { UserEntity } from "../../user.entity"
import { EntityValidationError } from "@/shared/errors/validation-error"

describe('UserEntity Integration Tests', () => {
  describe('Constructor Method', () => {
    describe('Name field', () => {
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

    describe('Email field', () => {
      it('should throw EntityValidationError when email is empty', () => {
        const userProps = {
          ...userDateBuilder(),
          email: ''
        }
        expect(() => new UserEntity(userProps)).toThrow(EntityValidationError)
      })

      it('should throw EntityValidationError when email is a number', () => {
        const props = {
          ...userDateBuilder(),
          email: 123 as any
        };
        expect(() => new UserEntity(props)).toThrow(EntityValidationError)
      })

      it('should throw EntityValidationError when email is longer than 255 characters', () => {
        const props = {
          ...userDateBuilder(),
          email: 'a'.repeat(256)
        };
        expect(() => new UserEntity(props)).toThrow(EntityValidationError)
      })

      it('should throw EntityValidationError when email is null', () => {
        const props = {
          ...userDateBuilder(),
          name: null as any
        };
        expect(() => new UserEntity(props)).toThrow(EntityValidationError)
      })

    })

    describe('Password field', () => {
      it('should throw EntityValidationError when password is empty', () => {
        const props = {
          ...userDateBuilder(),
          password: ''
        }
        expect(() => new UserEntity(props)).toThrow(EntityValidationError)
      })

      it('should throw EntityValidationError when password is longer than 100 characters', () => {
        const props = {
          ...userDateBuilder(),
          password: 'a'.repeat(101)
        };
        expect(() => new UserEntity(props)).toThrow(EntityValidationError)
      })

      it('should throw EntityValidationError when password is null', () => {
        const props = {
          ...userDateBuilder(),
          password: null as any
        };
        expect(() => new UserEntity(props)).toThrow(EntityValidationError)
      })
    })

    describe('CreatedAt', () => {
      it('should throw EntityValidationError when createdAt is not Date', () => {
        const props = {
          ...userDateBuilder(),
          createdAt: 123 as any
        };
        expect(() => new UserEntity(props)).toThrow(EntityValidationError)
      })
    })
  })
})
