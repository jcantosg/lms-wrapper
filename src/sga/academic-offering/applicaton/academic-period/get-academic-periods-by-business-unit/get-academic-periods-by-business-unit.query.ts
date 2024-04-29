import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { Query } from '#shared/domain/bus/query';

export class GetAcademicPeriodsByBusinessUnitQuery implements Query {
  constructor(
    public readonly businessUnit: string,
    public readonly adminUser: AdminUser,
  ) {}
}
