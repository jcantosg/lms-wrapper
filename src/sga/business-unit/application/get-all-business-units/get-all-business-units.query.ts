import { CollectionQuery } from '#/sga/shared/application/collection.query';
import { Query } from '#shared/domain/bus/query';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';

export class GetAllBusinessUnitsQuery extends CollectionQuery implements Query {
  constructor(
    readonly page: number,
    readonly limit: number,
    readonly orderBy: string,
    readonly orderType: OrderTypes,
    public readonly name?: string,
    public readonly code?: string,
    public readonly isActive?: boolean,
    public readonly country?: string,
  ) {
    super(page, limit, orderBy, orderType);
  }
}
