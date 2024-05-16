import { Filter } from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';

export class Criteria {
  constructor(
    public readonly filters: Filter[] = [],
    public readonly order: Order | null = null,
    public page: number | null = null,
    public limit: number | null = null,
  ) {}

  public hasFilters(): boolean {
    return this.filters.length > 0;
  }
}
