import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { Query } from '#shared/domain/bus/query';

export class GetSpecialtiesByAcademicProgramQuery implements Query {
  constructor(
    public readonly academicProgramId: string,
    public readonly adminUser: AdminUser,
  ) {}
}