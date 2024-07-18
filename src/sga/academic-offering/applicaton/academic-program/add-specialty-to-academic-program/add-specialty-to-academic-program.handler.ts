import { CommandHandler } from '#shared/domain/bus/command.handler';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AddSpecialtyToAcademicProgramCommand } from '#academic-offering/applicaton/academic-program/add-specialty-to-academic-program/add-specialty-to-academic-program.command';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';
import { ProgramBlockRepository } from '#academic-offering/domain/repository/program-block.repository';
import { InvalidSubjectTypeException } from '#shared/domain/exception/academic-offering/subject.invalid-type.exception';
import { AcademicProgramMisMatchBusinessUnitException } from '#shared/domain/exception/academic-offering/academic-program.missmatch-business-unit.exception';

export class AddSpecialtyToAcademicProgramHandler implements CommandHandler {
  constructor(
    private readonly repository: ProgramBlockRepository,
    private readonly academicProgramGetter: AcademicProgramGetter,
    private readonly subjectGetter: SubjectGetter,
  ) {}

  async handle(command: AddSpecialtyToAcademicProgramCommand): Promise<void> {
    const academicProgram = await this.academicProgramGetter.getByAdminUser(
      command.academicProgramId,
      command.adminUser.businessUnits.map((bu) => bu.id),
      command.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    const subject = await this.subjectGetter.getByAdminUser(
      command.subjectId,
      command.adminUser.businessUnits.map(
        (businessUnit: BusinessUnit) => businessUnit.id,
      ),
      command.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    if (subject.type !== SubjectType.SPECIALTY) {
      throw new InvalidSubjectTypeException();
    }

    if (subject.businessUnit.id !== academicProgram.businessUnit.id) {
      throw new AcademicProgramMisMatchBusinessUnitException();
    }

    const firstBlock = academicProgram.programBlocks[0];
    firstBlock.addSubject(subject, command.adminUser);

    await this.repository.save(firstBlock);
  }
}
