import { Query } from '#shared/domain/bus/query';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class GetSubjectsNotEnrolledQuery implements Query {
  constructor(
    public readonly academicRecordId: string,
    public readonly adminUser: AdminUser,
  ) {}
}
