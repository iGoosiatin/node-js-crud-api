class BaseValidator {
  name: string;
  input: unknown;

  constructor(name: string, input: string | number | unknown | unknown[]) {
    this.name = name;
    this.input = input;
  }

  protected invalidate(message = 'is invalid'): never {
    throw new Error(`${this.name} ${message}`);
  }
}

export default class Validator extends BaseValidator {
  input: unknown;

  isString() {
    if (typeof this.input === 'string' || this.input instanceof String) {
      return new StringValidator(this.name, this.input.toString());
    }
    this.invalidate('should be string');
  }

  isNumber() {
    if (typeof this.input === 'number' || this.input instanceof Number) {
      return new NumberValidator(this.name, this.input.valueOf());
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

class NumberValidator extends BaseValidator {
  input: number;

  constructor(name: string, input: number) {
    super(name, input);
  }
}

class StringValidator extends BaseValidator {
  input: string;

  constructor(name: string, input: string) {
    super(name, input);
  }

  isUUID() {
    if (this.input.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
      return this;
    }
    this.invalidate('should be proper UUID');
  }
}

class ArrayValidator extends BaseValidator {
  input: unknown[];

  constructor(name: string, input: unknown[]) {
    super(name, input);
  }

  ofStrings() {
    if (this.input.every((element) => typeof element === 'string' || element instanceof String)) {
      return this;
    }
    this.invalidate('should contain only strings');
  }
}
