import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { Query } from '#shared/domain/bus/query';

export class GetSubjectsByProgramBlockQuery implements Query {
  constructor(
    public readonly blockId: string,
    public readonly adminUser: AdminUser,
  ) {}
}
