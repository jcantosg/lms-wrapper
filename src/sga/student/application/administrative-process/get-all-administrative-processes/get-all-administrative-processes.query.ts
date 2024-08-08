import { CollectionQuery } from '#/sga/shared/application/collection.query';
import { Query } from '#shared/domain/bus/query';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { MonthEnum } from '#/sga/shared/domain/enum/month.enum';

export class GetAllAdministrativeProcessesQuery
  extends CollectionQuery
  implements Query
{
  constructor(
    public readonly adminUser: AdminUser,
    page: number,
    limit: number,
    orderBy: string,
    orderType: OrderTypes,
    public readonly name?: string,
    public readonly businessUnit?: string,
    public readonly createdAt?: string,
    public readonly updatedAt?: string,
    public readonly type?: MonthEnum,
    public readonly status?: string,
  ) {
    super(page, limit, orderBy, orderType);
  }
}
