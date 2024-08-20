import { Query } from '#shared/domain/bus/query';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class GetStudentAdministrativeProcessDocumentsQuery implements Query {
  constructor(
    public readonly adminUser: AdminUser,
    public readonly studentId: string,
  ) {}
}
