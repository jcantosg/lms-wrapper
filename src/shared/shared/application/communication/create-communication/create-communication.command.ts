import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class CreateCommunicationCommand {
  constructor(
    public readonly id: string,
    public readonly businessUnitIds: string[],
    public readonly academicPeriodIds: string[],
    public readonly titleIds: string[],
    public readonly academicProgramIds: string[],
    public readonly internalGroupIds: string[],
    public readonly studentIds: string[],
    public readonly adminUser: AdminUser,
  ) {}
}
