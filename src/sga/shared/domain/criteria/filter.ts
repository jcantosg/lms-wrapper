export enum FilterOperators {
  EQUALS = '=',
  LIKE = 'LIKE',
  GT = '>',
  LT = '<',
  IN = 'IN',
}

export class Filter {
  constructor(
    public readonly field: string,
    public readonly value: unknown,
    public readonly operator: FilterOperators = FilterOperators.EQUALS,
    public readonly relationPath?: string,
  ) {}
}
