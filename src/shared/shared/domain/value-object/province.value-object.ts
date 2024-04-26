import { ValueObject } from '#/sga/shared/domain/value-object/value-object';

export class Province extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }
}
