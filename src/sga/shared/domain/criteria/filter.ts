export enum FilterOperators {
  EQUALS = 'EQUALS',
  LIKE = 'LIKE',
}

export class Filter {
  constructor(
    public readonly field: string,
    public readonly value: unknown,
    public readonly operator: FilterOperators = FilterOperators.EQUALS,
    public readonly relationPath?: string,
  ) {}
}
