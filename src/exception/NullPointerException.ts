export class NullPointerException extends Error {
  constructor(field: string) {
    super(`${field} is null or undefined`);
    this.name = 'NullPointerException';
  }
}
