import { Query } from '#shared/domain/bus/query';
import { CollectionQuery } from '#/sga/shared/application/collection.query';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class SearchCommunicationsQuery
  extends CollectionQuery
  implements Query
{
  constructor(
    public readonly subjectText: string,
    page: number,
    limit: number,
    orderBy: string,
    orderType: OrderTypes,
    public readonly adminUser: AdminUser,
  ) {
    super(page, limit, orderBy, orderType);
  }
}
