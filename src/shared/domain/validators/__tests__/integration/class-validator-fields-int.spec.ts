import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";
import { ClassValidatorFields } from "../../class-validator-fields";

type StubClassProps = {
  name: string;
  price: number;
};

class StubClass {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNumber()
  @IsNotEmpty()
  price: number;

  constructor(data: StubClassProps) {
    Object.assign(this, data);
  }
}


class StubClassValidator extends ClassValidatorFields<StubClass> {
  validate(data: any): boolean {
    return super.validate(new StubClass(data))
  }
}

describe('ClassValidatorFields Integration Tests', () => {
  it('Should validate successfully when data is valid', () => {
    const validator = new StubClassValidator();
    expect(validator.validate({ name: 'Pc Gamer', price: 6999 })).toBeTruthy();
    expect(validator.errors).toBeNull();
    expect(validator.validatedData).toStrictEqual(new StubClass({ name: 'Pc Gamer', price: 6999 }));
  });

  it('Should return validation errors when data is invalid', () => {
    const validator = new StubClassValidator();
    expect(validator.validate({})).toBeFalsy();
    expect(validator.errors).toStrictEqual({
      name: [
        'name should not be empty',
        'name must be a string',
        'name must be shorter than or equal to 255 characters'
      ],
      price: [
        'price should not be empty',
        'price must be a number conforming to the specified constraints'
      ]
    });
    expect(validator.validatedData).toBeNull();
  });
});
