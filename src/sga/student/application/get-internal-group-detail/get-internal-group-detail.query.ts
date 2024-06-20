import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { Query } from '#shared/domain/bus/query';

export class GetInternalGroupDetailQuery implements Query {
  constructor(
    public readonly internalGroupId: string,
    public readonly user: AdminUser,
  ) {}
}
