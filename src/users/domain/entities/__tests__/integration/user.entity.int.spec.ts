import { userDateBuilder } from "@/users/domain/testing/helpers/user-data-builder"
import { UserEntity } from "../../user.entity"
import { EntityValidationError } from "@/shared/errors/validation-error"

describe('UserEntity Integration Tests', () => {
  describe('Constructor Method', () => {
    describe('User Valid', () => {
      it('should create a valid user without throwing', () => {
        const userProps = userDateBuilder();
        expect(() => new UserEntity(userProps)).not.toThrow();
      });
    })

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

  describe('Update Fields', () => {
    it('should update the name successfully', () => {
      const userProps = userDateBuilder();
      const user = new UserEntity(userProps);
      expect(() => user.update('linus')).not.toThrow();
      expect(user.props.name).toStrictEqual('linus');
    });

    it('should throw error when updating name with empty string', () => {
      const userProps = userDateBuilder();
      const user = new UserEntity(userProps);
      expect(() => user.update('' as any)).toThrow(EntityValidationError);
    });

    it('should throw error when updating name with string longer than 255 characters', () => {
      const userProps = userDateBuilder();
      const user = new UserEntity(userProps);
      expect(() => user.update('a'.repeat(256) as any)).toThrow(EntityValidationError);
    });

    it('should throw error when updating name with null', () => {
      const userProps = userDateBuilder();
      const user = new UserEntity(userProps);
      expect(() => user.update(null as any)).toThrow(EntityValidationError);
    });

    it('should throw error when updating name with number', () => {
      const userProps = userDateBuilder();
      const user = new UserEntity(userProps);
      expect(() => user.update(123 as any)).toThrow(EntityValidationError);
    });
  });

  describe('Update Password', () => {
    it('should update the password successfully', () => {
      const userProps = userDateBuilder();
      const user = new UserEntity(userProps);
      expect(() => user.updatePassword('admin123')).not.toThrow();
      expect(user.password).toStrictEqual('admin123');
    });

    it('should throw error when updating password with empty string', () => {
      const userProps = userDateBuilder();
      const user = new UserEntity(userProps);
      expect(() => user.updatePassword('' as any)).toThrow(EntityValidationError);
    });

    it('should throw error when updating password with string longer than 255 characters', () => {
      const userProps = userDateBuilder();
      const user = new UserEntity(userProps);
      expect(() => user.updatePassword('a'.repeat(256) as any)).toThrow(EntityValidationError);
    });

    it('should throw error when updating password with null', () => {
      const userProps = userDateBuilder();
      const user = new UserEntity(userProps);
      expect(() => user.updatePassword(null as any)).toThrow(EntityValidationError);
    });
  })
})
