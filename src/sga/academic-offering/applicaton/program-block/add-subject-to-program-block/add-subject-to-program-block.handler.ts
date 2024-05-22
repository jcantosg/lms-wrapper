import { CommandHandler } from '#shared/domain/bus/command.handler';
import { ProgramBlockRepository } from '#academic-offering/domain/repository/program-block.repository';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { ProgramBlockGetter } from '#academic-offering/domain/service/program-block/program-block-getter.service';
import { AddSubjectToProgramBlockCommand } from '#academic-offering/applicaton/program-block/add-subject-to-program-block/add-subject-to-program-block.command';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { ProgramBlockMisMatchBusinessUnitException } from '#shared/domain/exception/academic-offering/program-block.mismatch-business-unit.exception';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';

export class AddSubjectToProgramBlockHandler implements CommandHandler {
  constructor(
    private readonly repository: ProgramBlockRepository,
    private readonly subjectRepository: SubjectRepository,
    private readonly programBlockGetter: ProgramBlockGetter,
    private readonly subjectGetter: SubjectGetter,
  ) {}

  async handle(command: AddSubjectToProgramBlockCommand): Promise<void> {
    const programBlock = await this.programBlockGetter.getByAdminUser(
      command.programBlockId,
      command.adminUser,
    );
    const subject = await this.subjectGetter.getByAdminUser(
      command.subjectId,
      command.adminUser.businessUnits.map(
        (businessUnit: BusinessUnit) => businessUnit.id,
      ),
      command.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    if (
      subject.businessUnit.id !== programBlock.academicProgram.businessUnit.id
    ) {
      throw new ProgramBlockMisMatchBusinessUnitException();
    }

    const assignedSubjectsByProgram =
      await this.subjectRepository.getSubjectsByAcademicProgram(
        programBlock.academicProgram.id,
      );

    if (
      assignedSubjectsByProgram.every(
        (assignedSubject) => assignedSubject.id !== subject.id,
      )
    ) {
      programBlock.addSubject(subject, command.adminUser);
      await this.repository.save(programBlock);
    }
  }
}
