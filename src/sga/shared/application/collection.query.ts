import { OrderByDefault, OrderTypes } from '#/sga/shared/domain/criteria/order';

export const FIRST_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const LOW_LIMIT = 1;

export class CollectionQuery {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly orderBy: string = OrderByDefault,
    public readonly orderType: OrderTypes = OrderTypes.DESC,
  ) {}
}
