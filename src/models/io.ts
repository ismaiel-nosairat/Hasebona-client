export interface RE {
  code?: number;
  data?: any;
  message?: string;
}
export interface ME {
  code?: number;
  message?: string;
  isKnown?: boolean;
  additionalInfo?: string;
  source?: any;
}
export class ManagedError extends Error {
  code?: number;
  source: any;
  constructor(message?: string, code?: number, source?: any) {
    super(message);
    this.code = code;
    this.source = source;
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ManagedError.prototype);
  }

  sayHello() {
    return "hello " + this.message;
  }
}
