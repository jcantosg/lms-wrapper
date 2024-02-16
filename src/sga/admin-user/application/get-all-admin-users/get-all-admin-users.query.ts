import { CollectionQuery } from '#/sga/shared/application/collection.query';
import { Query } from '#shared/domain/bus/query';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

export class GetAllAdminUsersQuery extends CollectionQuery implements Query {
  constructor(
    readonly adminUserBusinessUnits: BusinessUnit[],
    readonly adminUserRoles: AdminUserRoles[],
    readonly page: number,
    readonly limit: number,
    readonly orderBy: string,
    readonly orderType: OrderTypes,
    public readonly name?: string,
    public readonly surname?: string,
    public readonly businessUnitName?: string,
    public readonly email?: boolean,
    public readonly role?: AdminUserRoles,
  ) {
    super(page, limit, orderBy, orderType);
  }
}
