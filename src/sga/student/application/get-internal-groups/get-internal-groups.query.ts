import { Query } from '#shared/domain/bus/query';
import { CollectionQuery } from '#/sga/shared/application/collection.query';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class GetInternalGroupsQuery extends CollectionQuery implements Query {
  constructor(
    public readonly startDate: string | null,
    public readonly academicPeriod: string | null,
    public readonly code: string | null,
    public readonly businessUnit: string | null,
    public readonly academicProgram: string | null,
    public readonly subject: string | null,
    public readonly adminUser: AdminUser,
    page: number,
    limit: number,
    orderBy: string,
    orderType: OrderTypes,
  ) {
    super(page, limit, orderBy, orderType);
  }
}
