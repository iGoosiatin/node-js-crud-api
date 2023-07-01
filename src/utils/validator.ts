class BaseValidator {
  name: string;
  input: unknown;
  shouldSkip = false;

  constructor(name: string, input: unknown, shouldSkip = false) {
    this.name = name;
    this.input = input;
    this.shouldSkip = shouldSkip;
  }

  protected invalidate(message = 'is invalid'): never {
    throw new Error(`${this.name} ${message}`);
  }
}

export default class Validator extends BaseValidator {
  input: unknown;
  required = true;

  isOptional() {
    this.required = false;
    this.shouldSkip = this.input === undefined;
    return this;
  }

  isString() {
    this.ensure();

    if (this.shouldSkip) {
      return new StringValidator(this.name, '', this.shouldSkip);
    }

    if (typeof this.input === 'string' || this.input instanceof String) {
      return new StringValidator(this.name, this.input.toString());
    }
    this.invalidate('should be string');
  }

  isNumber() {
    this.ensure();

    if (this.shouldSkip) {
      return new NumberValidator(this.name, 0, this.shouldSkip);
    }

    if (typeof this.input === 'number' || this.input instanceof Number) {
      return new NumberValidator(this.name, this.input.valueOf());
    }
    this.invalidate('should be number');
  }

  isArray() {
    this.ensure();

    if (this.shouldSkip) {
      return new ArrayValidator(this.name, [], this.shouldSkip);
    }

    if (Array.isArray(this.input)) {
      return new ArrayValidator(this.name, this.input);
    }
    this.invalidate('should be array');
  }

  private ensure() {
    if (this.required && this.input === undefined) {
      this.invalidate(`is required`);
    }
  }
}

class NumberValidator extends BaseValidator {
  input: number;
}

class StringValidator extends BaseValidator {
  input: string;

  isUUID() {
    if (this.shouldSkip) {
      return this;
    }

    if (this.input.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
      return this;
    }
    this.invalidate('should be proper UUID');
  }
}

class ArrayValidator extends BaseValidator {
  input: unknown[];

  ofStrings() {
    if (this.input.every((element) => typeof element === 'string' || element instanceof String)) {
      return this;
    }
    this.invalidate('should contain only strings');
  }
}
