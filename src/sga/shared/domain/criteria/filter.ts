export enum FilterOperators {
  EQUALS = '=',
  LIKE = 'LIKE',
  GT = '>',
  LT = '<',
  IN = 'IN',
  ANY = 'ANY',
  OVERLAP = '&&',
}

export enum GroupOperator {
  AND = 'AND',
  OR = 'OR',
}

export class Filter {
  constructor(
    public readonly field: string,
    public readonly value: unknown,
    public readonly operator: FilterOperators,
    public readonly groupOperator: GroupOperator,
    public readonly relationPath?: string,
    public readonly relationObject?: string,
  ) {}
}
