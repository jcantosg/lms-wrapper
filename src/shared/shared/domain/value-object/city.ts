import { ValueObject } from '#/sga/shared/domain/value-object/value-object';

export class City extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }
}
