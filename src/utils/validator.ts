class BaseValidator {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  protected invalidate(message = 'is invalid'): never {
    throw new Error(`${this.name} ${message}`);
  }
}

export default class Validator extends BaseValidator {
  input: unknown;

  constructor(name: string, input: unknown) {
    super(name);
    this.input = input;
  }

  isUUID() {
    if (typeof this.input === 'string' || this.input instanceof String) {
      if (this.input.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
        return this;
      }
    }
    this.invalidate('should be proper UUID');
  }

  isString() {
    if (typeof this.input === 'string' || this.input instanceof String) {
      return this;
    }
    this.invalidate('should be string');
  }

  isNumber() {
    if (typeof this.input === 'number' || this.input instanceof Number) {
      return this;
    }
    this.invalidate('should be number');
  }

  isArray() {
    if (Array.isArray(this.input)) {
      return new ArrayValidator(this.name, this.input);
    }
    this.invalidate('should be array');
  }
}

class ArrayValidator extends BaseValidator {
  input: unknown[];

  constructor(name: string, input: unknown[]) {
    super(name);
    this.input = input;
  }

  ofStrings() {
    if (this.input.every((element) => typeof element === 'string' || element instanceof String)) {
      return this;
    }
    this.invalidate('should contain only strings');
  }
}
