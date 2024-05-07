import { CommandHandler } from '#shared/domain/bus/command.handler';
import { ProgramBlockRepository } from '#academic-offering/domain/repository/program-block.repository';
import { ProgramBlockGetter } from '#academic-offering/domain/service/program-block/program-block-getter.service';
import { DeleteProgramBlockCommand } from '#academic-offering/applicaton/program-block/delete-program-block/delete-program-block.command';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { AcademicProgramHasRelatedAcademicPeriodException } from '#shared/domain/exception/academic-offering/academic-program.has-related-academic-period.exception';
import { ProgramBlockHasSubjectsException } from '#shared/domain/exception/academic-offering/program-block.has-subjects.exception';
import { AcademicProgramRepository } from '#academic-offering/domain/repository/academic-program.repository';

export class DeleteProgramBlockHandler implements CommandHandler {
  constructor(
    private readonly repository: ProgramBlockRepository,
    private programBlockGetter: ProgramBlockGetter,
    private academicProgramGetter: AcademicProgramGetter,
    private academicProgramRepository: AcademicProgramRepository,
  ) {}

  public async handle(command: DeleteProgramBlockCommand): Promise<void> {
    const programBlock = await this.programBlockGetter.getByAdminUser(
      command.id,
      command.adminUser,
    );

    if (programBlock.hasSubjects()) {
      throw new ProgramBlockHasSubjectsException();
    }

    const academicProgram = await this.academicProgramGetter.get(
      programBlock.academicProgram.id,
    );

    if (academicProgram.isRelatedToAcademicPeriod()) {
      throw new AcademicProgramHasRelatedAcademicPeriodException();
    }
    academicProgram.removeProgramBlock(programBlock);
    await this.academicProgramRepository.save(academicProgram);
    await this.repository.delete(programBlock);
  }
}
