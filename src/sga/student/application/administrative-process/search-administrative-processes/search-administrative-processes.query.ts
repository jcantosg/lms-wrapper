import { CollectionQuery } from '#/sga/shared/application/collection.query';
import { Query } from '#shared/domain/bus/query';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class SearchAdministrativeProcessesQuery
  extends CollectionQuery
  implements Query
{
  constructor(
    public readonly adminUser: AdminUser,
    page: number,
    limit: number,
    orderBy: string,
    orderType: OrderTypes,
    public readonly text: string,
  ) {
    super(page, limit, orderBy, orderType);
  }
}
