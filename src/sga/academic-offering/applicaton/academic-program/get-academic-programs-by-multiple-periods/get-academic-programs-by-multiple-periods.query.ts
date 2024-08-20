import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class GetAcademicProgramsByPeriodsQuery {
  constructor(
    public readonly academicPeriodIds: string[],
    public readonly adminUser: AdminUser,
  ) {}
}
