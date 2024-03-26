export class InvalidParamterException extends Error {
  constructor(field: string) {
    super(`${field} not matched with the type`);
    this.name = 'InvalidParamterException';
  }
}
