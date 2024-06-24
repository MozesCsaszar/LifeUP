export class InstanceExistsError extends Error {
    constructor(className) {
        super(`Instance of ${className} already exists!`);
        this.name = "InstanceExistsError";
    }
}
