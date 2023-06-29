export default class Validator {
  input: unknown;
  name: string;

  constructor(name: string, input: unknown) {
    this.input = input;
    this.name = name;
  }

  isUUID() {
    if (typeof this.input === 'string' || this.input instanceof String) {
      if (this.input.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
        return this;
      }
    }
    throw new Error(`${this.name} should be proper UUID`);
  }

  isString() {
    if (typeof this.input === 'string' || this.input instanceof String) {
      return this;
    }
    throw new Error(`${this.name} should be string`);
  }

  isNumber() {
    if (typeof this.input === 'number' || this.input instanceof Number) {
      return this;
    }
    throw new Error(`${this.name} should be number`);
  }

  isArray() {
    if (Array.isArray(this.input)) {
      return new ArrayValidator(this.name, this.input);
    }
    throw new Error(`${this.name} should be array`);
  }
}

class ArrayValidator {
  input: unknown[];
  name: string;

  constructor(name: string, input: unknown[]) {
    this.input = input;
    this.name = name;
  }

  ofStrings() {
    if (this.input.every((element) => typeof element === 'string' || element instanceof String)) {
      return this;
    }
    throw new Error(`${this.name} should contain only strings`);
  }
}
