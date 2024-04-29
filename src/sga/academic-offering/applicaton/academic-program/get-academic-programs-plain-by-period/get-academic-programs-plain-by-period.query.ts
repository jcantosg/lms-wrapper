import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class GetAcademicProgramsPlainByPeriodQuery {
  constructor(
    public readonly academicPeriodId: string,
    public readonly adminUser: AdminUser,
  ) {}
}
