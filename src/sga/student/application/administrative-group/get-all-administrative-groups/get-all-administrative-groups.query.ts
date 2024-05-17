import { CollectionQuery } from '#/sga/shared/application/collection.query';
import { Query } from '#shared/domain/bus/query';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { MonthEnum } from '#/sga/shared/domain/enum/month.enum';

export class GetAllAdministrativeGroupsQuery
  extends CollectionQuery
  implements Query
{
  constructor(
    public readonly adminUser: AdminUser,
    page: number,
    limit: number,
    orderBy: string,
    orderType: OrderTypes,
    public readonly code?: string,
    public readonly academicProgramId?: string,
    public readonly academicPeriodId?: string,
    public readonly businessUnitId?: string,
    public readonly startMonth?: MonthEnum,
    public readonly academicYear?: string,
    public readonly blockName?: string,
  ) {
    super(page, limit, orderBy, orderType);
  }
}
