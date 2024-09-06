import { CollectionQuery } from '#/sga/shared/application/collection.query';
import { Query } from '#shared/domain/bus/query';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdministrativeProcessTypeEnum } from '#student/domain/enum/administrative-process-type.enum';
import { AdministrativeProcessStatusEnum } from '#student/domain/enum/administrative-process-status.enum';

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
    public readonly type?: AdministrativeProcessTypeEnum,
    public readonly status?: AdministrativeProcessStatusEnum,
  ) {
    super(page, limit, orderBy, orderType);
  }
}
