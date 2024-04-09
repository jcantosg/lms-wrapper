import { Query } from '#shared/domain/bus/query';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class GetEvaluationTypesQuery implements Query {
  constructor(
    public readonly businessUnitId: string,
    public readonly adminUser: AdminUser,
  ) {}
}
