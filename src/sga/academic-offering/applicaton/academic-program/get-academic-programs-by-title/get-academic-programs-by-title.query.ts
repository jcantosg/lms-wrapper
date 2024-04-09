import { CollectionQuery } from '#/sga/shared/application/collection.query';
import { Query } from '#shared/domain/bus/query';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class GetAcademicProgramsByTitleQuery
  extends CollectionQuery
  implements Query
{
  constructor(
    page: number,
    limit: number,
    orderBy: string,
    orderType: OrderTypes,
    public readonly titleId: string,
    public readonly adminUser: AdminUser,
  ) {
    super(page, limit, orderBy, orderType);
  }
}
