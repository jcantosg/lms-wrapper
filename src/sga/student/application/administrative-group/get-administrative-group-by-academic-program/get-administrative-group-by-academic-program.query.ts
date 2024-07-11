import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { Query } from '#shared/domain/bus/query';

export class GetAdministrativeGroupByAcademicProgramQuery implements Query {
  constructor(
    public readonly academicProgramId: string,
    public readonly adminUser: AdminUser,
  ) {}
}
