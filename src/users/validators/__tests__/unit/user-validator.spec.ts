import { userDateBuilder } from "@/users/domain/testing/helpers/user-data-builder";
import { UserRules, UserValidator, UserValidatorFactory } from "../../user-validator"
import { UserProps } from "@/users/domain/entities/user.entity";

describe('UserValidator Unit Tests', () => {
  let SUT: UserValidator;

  beforeEach(() => {
    SUT = UserValidatorFactory.create();
  });

  it('should validate successfully when props is valid', () => {
    const userProps = userDateBuilder();
    const isValid: boolean = SUT.validate(userProps);
    expect(isValid).toBeTruthy();
    expect(SUT.validatedData).toStrictEqual(new UserRules(userProps));
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
      const isValid: boolean = SUT.validate(userProps);
      expect(isValid).toBeFalsy();
      expect(SUT.errors).toStrictEqual({
        name: ['name must be shorter than or equal to 255 characters']
      });
    });
  });

  describe('Email field validation', () => {
    it('should return all validation errors when props are empty', () => {
      const isValid: boolean = SUT.validate({} as UserProps);
      expect(isValid).toBeFalsy();
      expect(SUT.errors!['email']).toStrictEqual([
        'email must be an email',
        'email should not be empty',
        'email must be shorter than or equal to 255 characters'
      ])
    });

    it('should return error when email is an empty string', () => {
      const userProps = { ...userDateBuilder(), email: "" };
      const isValid: boolean = SUT.validate(userProps);
      expect(isValid).toBeFalsy();
      expect(SUT.errors).toStrictEqual(
        { email: ['email must be an email', 'email should not be empty'] }
      );
    });

    it('should return errors when email is not a string', () => {
      const userProps = { ...userDateBuilder(), email: 123 as any };
      const isValid: boolean = SUT.validate(userProps);
      expect(isValid).toBeFalsy();
      expect(SUT.errors).toStrictEqual({
        email: [
          'email must be an email',
          'email must be shorter than or equal to 255 characters'
        ]
      });
    });

    it('should return error when email exceeds 255 characters', () => {
      const userProps = { ...userDateBuilder(), email: 'a'.repeat(256) };
      const isValid: boolean = SUT.validate(userProps);
      expect(isValid).toBeFalsy();
      expect(SUT.errors).toStrictEqual({
        email: [
          'email must be an email',
          'email must be shorter than or equal to 255 characters'
        ]
      });
    });

  })

  describe('Passsword field validation', () => {

    it('should return all validation errors when props are empty', () => {
      const isValid: boolean = SUT.validate({} as UserProps);
      expect(isValid).toBeFalsy();
      expect(SUT.errors!['password']).toStrictEqual(
        [
          'password should not be empty',
          'password must be a string',
          'password must be shorter than or equal to 100 characters'
        ],
      );
    });

    it('should return error when password is an empty string', () => {
      const userProps = { ...userDateBuilder(), password: "" };
      const isValid: boolean = SUT.validate(userProps);
      expect(isValid).toBeFalsy();
      expect(SUT.errors).toStrictEqual({
        password: ['password should not be empty']
      });
    });

    it('should return errors when password is not a string', () => {
      const userProps = { ...userDateBuilder(), password: 123 as any };
      const isValid: boolean = SUT.validate(userProps);
      expect(isValid).toBeFalsy();
      expect(SUT.errors).toStrictEqual({
        password: [
          'password must be a string',
          'password must be shorter than or equal to 100 characters'
        ]
      });
    });

    it('should return error when name exceeds 255 characters', () => {
      const userProps = { ...userDateBuilder(), password: 'a'.repeat(256) };
      const isValid: boolean = SUT.validate(userProps);
      expect(isValid).toBeFalsy();
      expect(SUT.errors).toStrictEqual({
        password: ['password must be shorter than or equal to 100 characters']
      });
    });
  });

  describe('CreatedAt field validation', () => {

    it('should return error when createdAt is not a Date', () => {
      const userProps = { ...userDateBuilder(), createdAt: "" as any };
      const isValid: boolean = SUT.validate(userProps);
      expect(isValid).toBeFalsy();
      expect(SUT.errors).toStrictEqual({
        createdAt: ['createdAt must be a Date instance']
      });
    });
  });
});
