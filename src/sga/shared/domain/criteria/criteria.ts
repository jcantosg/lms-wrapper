import { Filter } from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';

export class Criteria {
  constructor(
    public readonly filters: Filter[] = [],
    public readonly order: Order,
    public page: number,
    public limit: number,
  ) {}

  public hasFilters(): boolean {
    return this.filters.length > 0;
  }
}
