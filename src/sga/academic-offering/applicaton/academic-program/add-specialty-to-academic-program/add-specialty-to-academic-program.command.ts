import { Command } from '#shared/domain/bus/command';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class AddSpecialtyToAcademicProgramCommand implements Command {
  constructor(
    public readonly academicProgramId: string,
    public readonly subjectId: string,
    public readonly adminUser: AdminUser,
  ) {}
}
