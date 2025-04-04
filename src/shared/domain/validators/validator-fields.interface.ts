export type FieldsErrors = {
  [field: string]: string[]
}

export interface ValidatorFieldsInterface<T> {
  errors: FieldsErrors | null;
  validatedData: T | null;
  validate(data: T): boolean
}