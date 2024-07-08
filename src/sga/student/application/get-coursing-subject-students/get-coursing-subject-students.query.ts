import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { Query } from '#shared/domain/bus/query';

export class GetCoursingSubjectStudentsQuery implements Query {
  constructor(
    public readonly subjectId: string,
    public readonly adminUser: AdminUser,
  ) {}
}
