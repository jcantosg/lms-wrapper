import { CollectionQuery } from '#/sga/shared/application/collection.query';
import { Query } from '#shared/domain/bus/query';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

export class SearchAdminUsersQuery extends CollectionQuery implements Query {
  constructor(
    readonly adminUserBusinessUnits: BusinessUnit[],
    readonly adminUserRoles: AdminUserRoles[],
    readonly page: number,
    readonly limit: number,
    readonly orderBy: string,
    readonly orderType: OrderTypes,
    public readonly text: string,
  ) {
    super(page, limit, orderBy, orderType);
  }
}
