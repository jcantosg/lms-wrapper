export type Primitives = string | number | object | boolean;

export abstract class ValueObject<T extends Primitives> {
  protected constructor(private _value: T) {}

  public get value(): T {
    return this._value;
  }
}
