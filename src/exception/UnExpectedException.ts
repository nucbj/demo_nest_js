export class UnExpectedException extends Error {
  constructor(field: string) {
    super(`${field} unexcepted error occured`);
    this.name = 'UnExpected';
  }
}
