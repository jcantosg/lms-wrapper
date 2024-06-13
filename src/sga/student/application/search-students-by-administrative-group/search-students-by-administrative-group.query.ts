import { CollectionQuery } from '#/sga/shared/application/collection.query';
import { Query } from '#shared/domain/bus/query';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';

export class SearchStudentsByAdministrativeGroupQuery
  extends CollectionQuery
  implements Query
{
  constructor(
    public readonly adminUser: AdminUser,
    public readonly text: string,
    page: number,
    limit: number,
    orderBy: string,
    orderType: OrderTypes,
    public readonly administrativeGroupId: string,
  ) {
    super(page, limit, orderBy, orderType);
  }
}
