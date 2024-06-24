export class InstanceExistsError extends Error {
  constructor(className: string) {
    super(`Instance of ${className} already exists!`);
    this.name = "InstanceExistsError";
  }
}
