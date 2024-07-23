import { CommandHandler } from '#shared/domain/bus/command.handler';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { ProgramBlockRepository } from '#academic-offering/domain/repository/program-block.repository';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { EnrollmentRepository } from '#student/domain/repository/enrollment.repository';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { RemoveSpecialtyFromAcademicProgramCommand } from '#academic-offering/applicaton/academic-program/remove-specialty-from-academic-program/remove-specialty-from-academic-program.command';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';
import { InvalidSubjectTypeException } from '#shared/domain/exception/academic-offering/subject.invalid-type.exception';
import { SubjectHasEnrollmentsException } from '#shared/domain/exception/academic-offering/subject.has-enrollments.exception';
import { ProgramBlockNotFoundException } from '#shared/domain/exception/academic-offering/program-block.not-found.exception';

export class RemoveSpecialtyFromAcademicProgramHandler
  implements CommandHandler
{
  constructor(
    private readonly academicProgramGetter: AcademicProgramGetter,
    private readonly subjectGetter: SubjectGetter,
    private readonly enrollmentRepository: EnrollmentRepository,
    private readonly programBlockRepository: ProgramBlockRepository,
  ) {}

  async handle(
    command: RemoveSpecialtyFromAcademicProgramCommand,
  ): Promise<void> {
    const academicProgram = await this.academicProgramGetter.getByAdminUser(
      command.academicProgramId,
      command.adminUser.businessUnits.map(
        (businessUnit: BusinessUnit) => businessUnit.id,
      ),
      command.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    const firstBlock =
      await this.programBlockRepository.getFirstBlockByProgram(academicProgram);

    if (!firstBlock) {
      throw new ProgramBlockNotFoundException();
    }

    const subject = await this.subjectGetter.getByAdminUser(
      command.subjectId,
      command.adminUser.businessUnits.map(
        (businessUnit: BusinessUnit) => businessUnit.id,
      ),
      command.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    const enrollments = await this.enrollmentRepository.getBySubject(
      subject,
      command.adminUser.businessUnits.map((bu) => bu.id),
      command.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    if (subject.type !== SubjectType.SPECIALTY) {
      throw new InvalidSubjectTypeException();
    }

    if (enrollments.length > 0) {
      throw new SubjectHasEnrollmentsException();
    }

    firstBlock.removeSubject(subject);

    await this.programBlockRepository.save(firstBlock);
  }
}
