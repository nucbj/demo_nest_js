export class NoSuchElementException extends Error {
  constructor(field: string) {
    super(`${field} is not found`);
    this.name = 'NoSuchElement';
  }
}
