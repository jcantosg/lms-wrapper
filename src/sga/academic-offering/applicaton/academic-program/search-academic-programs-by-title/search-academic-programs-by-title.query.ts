import { CollectionQuery } from '#/sga/shared/application/collection.query';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { Query } from '#shared/domain/bus/query';

export class SearchAcademicProgramsByTitleQuery
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
    public readonly text: string,
  ) {
    super(page, limit, orderBy, orderType);
  }
}
