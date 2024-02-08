import {
  Primitives,
  ValueObject,
} from '#/sga/shared/domain/value-object/value-object';
import { ValueObjectClass } from '#/sga/shared/domain/value-object/value-object-class';

export const ValueObjectTransformer = <T extends Primitives>(
  valueObject: ValueObjectClass<ValueObject<any>>,
) => {
  return {
    to: (value: ValueObject<T>): Primitives => value.value,
    from: (value: Primitives): ValueObject<T> => {
      return new valueObject(value);
    },
  };
};
