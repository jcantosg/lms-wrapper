import { CollectionQuery } from '#/sga/shared/application/collection.query';
import { Query } from '#shared/domain/bus/query';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';

export class SearchBusinessUnitsQuery extends CollectionQuery implements Query {
  constructor(
    readonly page: number,
    readonly limit: number,
    readonly orderBy: string,
    readonly orderType: OrderTypes,
    public readonly text: string,
  ) {
    super(page, limit, orderBy, orderType);
  }
}
