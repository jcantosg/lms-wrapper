import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class PromoteStudentCommand {
  constructor(
    public readonly academicRecordId: string,
    public readonly studentId: string,
    public readonly programBlock: ProgramBlock,
    public readonly adminUser: AdminUser,
  ) {}
}
