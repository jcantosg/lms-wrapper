import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class MoveStudentFromAdministrativeGroupCommand {
  constructor(
    public readonly studentIds: string[],
    public readonly administrativeGroupOriginId: string,
    public readonly administrativeGroupDestinationId: string,
    public readonly adminUser: AdminUser,
  ) {}
}
