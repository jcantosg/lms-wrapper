import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { Query } from '#shared/domain/bus/query';

export class GetAcademicRecordDetailQuery implements Query {
  constructor(
    public readonly id: string,
    public readonly adminUser: AdminUser,
  ) {}
}
