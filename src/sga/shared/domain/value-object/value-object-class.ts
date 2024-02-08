export interface ValueObjectClass<T> extends Function {
  new (...args: any[]): T;
}
