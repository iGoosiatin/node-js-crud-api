class BaseValidator {
  name: string;
  input: unknown;
  required = true;
  shouldSkip = false;

  constructor(name: string, input: string | number | unknown | unknown[]) {
    this.name = name;
    this.input = input;
  }

  protected _isOptional() {
    this.required = false;
    this.shouldSkip = this.input === undefined;
  }

  protected _ensure() {
    if (this.required && this.input === undefined) {
      this._invalidate(`is required`);
    }
  }

  protected _invalidate(message = 'is invalid'): never {
    throw new Error(`${this.name} ${message}`);
  }
}

export default class Validator extends BaseValidator {
  input: unknown;

  isOptional() {
    this._isOptional();
    return this;
  }

  isString() {
    this._ensure();

    if (this.shouldSkip) {
      return new StringValidator(this.name, '', this.shouldSkip);
    }

    if (typeof this.input === 'string' || this.input instanceof String) {
      return new StringValidator(this.name, this.input.toString());
    }
    this._invalidate('should be string');
  }

  isNumber() {
    this._ensure();

    if (this.shouldSkip) {
      return new NumberValidator(this.name, 0, this.shouldSkip);
    }

    if (typeof this.input === 'number' || this.input instanceof Number) {
      return new NumberValidator(this.name, this.input.valueOf());
    }
    this._invalidate('should be number');
  }

  isArray() {
    this._ensure();

    if (this.shouldSkip) {
      return new ArrayValidator(this.name, [], this.shouldSkip);
    }

    if (Array.isArray(this.input)) {
      return new ArrayValidator(this.name, this.input);
    }
    this._invalidate('should be array');
  }
}

class NumberValidator extends BaseValidator {
  input: number;

  constructor(name: string, input: number, shouldSkip = false) {
    super(name, input);
    this.shouldSkip = shouldSkip;
  }
}

class StringValidator extends BaseValidator {
  input: string;

  constructor(name: string, input: string, shouldSkip = false) {
    super(name, input);
    this.shouldSkip = shouldSkip;
  }

  isUUID() {
    if (this.shouldSkip) {
      return this;
    }

    if (this.input.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
      return this;
    }
    this._invalidate('should be proper UUID');
  }
}

class ArrayValidator extends BaseValidator {
  input: unknown[];

  constructor(name: string, input: unknown[], shouldSkip = false) {
    super(name, input);
    this.shouldSkip = shouldSkip;
  }

  ofStrings() {
    if (this.input.every((element) => typeof element === 'string' || element instanceof String)) {
      return this;
    }
    this._invalidate('should contain only strings');
  }
}
