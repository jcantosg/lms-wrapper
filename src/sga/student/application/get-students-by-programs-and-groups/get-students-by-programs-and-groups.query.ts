import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { Query } from '#shared/domain/bus/query';

export class GetStudentsByProgramsAndGroupsQuery implements Query {
  constructor(
    public readonly academicProgramIds: string[],
    public readonly internalGroupIds: string[],
    public readonly adminUser: AdminUser,
  ) {}
}
