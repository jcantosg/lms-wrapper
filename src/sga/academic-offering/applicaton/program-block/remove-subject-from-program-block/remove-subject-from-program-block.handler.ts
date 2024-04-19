import { CommandHandler } from '#shared/domain/bus/command.handler';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { ProgramBlockGetter } from '#academic-offering/domain/service/program-block/program-block-getter.service';
import { ProgramBlockRepository } from '#academic-offering/domain/repository/program-block.repository';
import { RemoveSubjectFromProgramBlockCommand } from '#academic-offering/applicaton/program-block/remove-subject-from-program-block/remove-subject-from-program-block.command';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

export class RemoveSubjectFromProgramBlockHandler implements CommandHandler {
  constructor(
    private readonly repository: ProgramBlockRepository,
    private readonly subjectGetter: SubjectGetter,
    private readonly programBlockGetter: ProgramBlockGetter,
  ) {}

  async handle(command: RemoveSubjectFromProgramBlockCommand): Promise<void> {
    const programBlock = await this.programBlockGetter.getByAdminUser(
      command.programBlockId,
      command.adminUser,
    );
    for (const subjectId of command.subjectIds) {
      const subject = await this.subjectGetter.getByAdminUser(
        subjectId,
        command.adminUser.businessUnits.map(
          (businessUnit: BusinessUnit) => businessUnit.id,
        ),
        command.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
      );
      programBlock.removeSubject(subject);
    }

    await this.repository.save(programBlock);
  }
}