import { Command } from '#shared/domain/bus/command';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class RemoveSpecialtyFromAcademicProgramCommand implements Command {
  constructor(
    public readonly subjectId: string,
    public readonly academicProgramId: string,
    public readonly adminUser: AdminUser,
  ) {}
}