import { Query } from '#shared/domain/bus/query';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class GetVirtualCampusByBusinessUnitQuery implements Query {
  constructor(
    public readonly businessUnit: string,
    public readonly adminUser: AdminUser,
  ) {}
}
