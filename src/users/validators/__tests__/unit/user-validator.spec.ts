import { userDateBuilder } from "@/users/domain/testing/helpers/user-data-builder";
import { UserRules, UserValidator, UserValidatorFactory } from "../../user-validator"
import { UserProps } from "@/users/domain/entities/user.entity";

describe('UserValidator Unit Tests', () => {
  let SUT: UserValidator;

  beforeEach(() => {
    SUT = UserValidatorFactory.create();
  });

  describe('Name field validation', () => {

    it('should return all validation errors when props are empty', () => {
      const isValid: boolean = SUT.validate({} as UserProps);
      expect(isValid).toBeFalsy();
      expect(SUT.errors!['name']).toStrictEqual(
        [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters'
        ],
      );
    });

    it('should return error when name is an empty string', () => {
      const userProps = { ...userDateBuilder(), name: "" };
      const isValid: boolean = SUT.validate(userProps);
      expect(isValid).toBeFalsy();
      expect(SUT.errors).toStrictEqual({
        name: ['name should not be empty']
      });
    });

    it('should return errors when name is not a string', () => {
      const userProps = { ...userDateBuilder(), name: 123 as any };
      const isValid: boolean = SUT.validate(userProps);
      expect(isValid).toBeFalsy();
      expect(SUT.errors).toStrictEqual({
        name: [
          'name must be a string',
          'name must be shorter than or equal to 255 characters'
        ]
      });
    });

    it('should return error when name exceeds 255 characters', () => {
      const userProps = { ...userDateBuilder(), name: 'a'.repeat(256) };
      const isValid : boolean = SUT.validate(userProps);
      expect(isValid).toBeFalsy();
      expect(SUT.errors).toStrictEqual({
        name: ['name must be shorter than or equal to 255 characters']
      });
    });

    it('should validate successfully when name is valid', () => {
      const userProps = userDateBuilder();
      const isValid : boolean = SUT.validate(userProps);
      expect(isValid).toBeTruthy();
      expect(SUT.validatedData).toStrictEqual(new UserRules(userProps));
    });
  });
});
