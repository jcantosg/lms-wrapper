import {
  Primitives,
  ValueObject,
} from '#/sga/shared/domain/value-object/value-object';
import { ValueObjectClass } from '#/sga/shared/domain/value-object/value-object-class';

export const ValueObjectTransformer = <T extends Primitives>(
  valueObject: ValueObjectClass<ValueObject<any>>,
) => {
  return {
    to: (
      value: ValueObject<T> | ValueObject<T>[],
    ): Primitives | Primitives[] => {
      if (Array.isArray(value)) {
        return value.map((v) => v.value);
      } else {
        return value?.value;
      }
    },
    from: (
      value: Primitives | Primitives[],
    ): ValueObject<T> | ValueObject<T>[] | null => {
      if (!value) {
        return null;
      }

      if (Array.isArray(value)) {
        const result: ValueObject<T>[] = [];
        value.forEach((v) => {
          result.push(new valueObject(v));
        });

        return result;
      } else {
        return new valueObject(value);
      }
    },
  };
};
