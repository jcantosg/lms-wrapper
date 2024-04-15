import { CommandHandler } from '#shared/domain/bus/command.handler';
import { ProgramBlockRepository } from '#academic-offering/domain/repository/program-block.repository';
import { CreateProgramBlockCommand } from '#academic-offering/applicaton/program-block/create-program-block/create-program-block.command';
import { ProgramBlockDuplicatedException } from '#shared/domain/exception/academic-offering/program-block.duplicated.exception';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { AcademicProgramHasRelatedAcademicPeriodException } from '#shared/domain/exception/academic-offering/academic-program.has-related-academic-period.exception';

export class CreateProgramBlockHandler implements CommandHandler {
  constructor(
    private programBlockRepository: ProgramBlockRepository,
    private academicProgramGetter: AcademicProgramGetter,
  ) {}

  async handle(command: CreateProgramBlockCommand): Promise<void> {
    const academicProgram = await this.academicProgramGetter.getByAdminUser(
      command.academicProgramId,
      command.adminUser.businessUnits.map((bu) => bu.id),
      command.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    if (academicProgram.isRelatedToAcademicPeriod()) {
      throw new AcademicProgramHasRelatedAcademicPeriodException();
    }

    if (await this.programBlockRepository.existsById(command.id)) {
      throw new ProgramBlockDuplicatedException();
    }

    const programBlockToAdd = ProgramBlock.create(
      command.id,
      command.name,
      academicProgram,
      command.adminUser,
    );

    await this.programBlockRepository.save(programBlockToAdd);
  }
}
