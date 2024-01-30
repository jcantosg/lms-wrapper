import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { Command } from '#shared/domain/bus/command';

export class CreateExaminationCenterCommand implements Command {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly code: string,
    public readonly businessUnits: string[],
    public readonly address: string,
    public readonly user: AdminUser,
    public readonly countryId: string,
  ) {}
}
