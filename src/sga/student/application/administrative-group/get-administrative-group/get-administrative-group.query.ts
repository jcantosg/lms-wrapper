import { Query } from '#shared/domain/bus/query';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class GetAdministrativeGroupQuery implements Query {
  constructor(
    public readonly id: string,
    public readonly adminUser: AdminUser,
  ) {}
}
