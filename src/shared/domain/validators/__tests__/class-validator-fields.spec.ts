import { ClassValidatorFields } from "../class-validator-fields";
import * as libClassValidator from "class-validator";

class StubClassValidator extends ClassValidatorFields<{ field: string }> { }

describe('ClassValidatorFields Unit Tests', () => {
  it('should initialize errors and validatedData as null', () => {
    const SUT = new StubClassValidator();
    expect(SUT.errors).toBeNull();
    expect(SUT.validatedData).toBeNull();
  });

  it("should return false and store errors when validation fails", () => {
    const spyValidateSync = jest.spyOn(libClassValidator, 'validateSync');
    spyValidateSync.mockReturnValue([
      { property: 'field', constraints: { isRequired: 'test error' } }
    ]);
    const SUT = new StubClassValidator();
    expect(SUT.validate(null)).toBeFalsy();
    expect(SUT.validatedData).toBeNull();
    expect(SUT.errors).toStrictEqual({ field: ['test error'] });
  });

  it("should return true and store validated data when validation succeeds", () => {
    const spyValidateSync = jest.spyOn(libClassValidator, 'validateSync');
    spyValidateSync.mockReturnValue([]);
    const SUT = new StubClassValidator();
    expect(SUT.validate({ field: 'value' })).toBeTruthy();
    expect(SUT.validatedData).toStrictEqual({ field: 'value' });
    expect(SUT.errors).toBeNull();
  });
});
