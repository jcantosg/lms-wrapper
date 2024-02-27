import { Query } from '#shared/domain/bus/query';
import { OrderByDefault, OrderTypes } from '#/sga/shared/domain/criteria/order';

export class SearchEdaeUsersQuery implements Query {
  constructor(
    public readonly text: string,
    public readonly orderBy: string = OrderByDefault,
    public readonly orderType: OrderTypes = OrderTypes.DESC,
    public readonly page: number,
    public readonly limit: number,
    public readonly adminUserBusinessUnits: string[],
    public readonly isSuperAdmin: boolean,
  ) {}
}
