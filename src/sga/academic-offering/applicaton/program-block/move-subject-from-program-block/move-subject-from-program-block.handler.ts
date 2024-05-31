import { CommandHandler } from '#shared/domain/bus/command.handler';
import { ProgramBlockRepository } from '#academic-offering/domain/repository/program-block.repository';
import { MoveSubjectFromProgramBlockCommand } from '#academic-offering/applicaton/program-block/move-subject-from-program-block/move-subject-from-program-block.command';
import { ProgramBlockGetter } from '#academic-offering/domain/service/program-block/program-block-getter.service';
import { ProgramBlockNotFoundException } from '#shared/domain/exception/academic-offering/program-block.not-found.exception';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { SubjectNotFoundException } from '#shared/domain/exception/academic-offering/subject.not-found.exception';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';

export class MoveSubjectFromProgramBlockHandler implements CommandHandler {
  constructor(
    private readonly repository: ProgramBlockRepository,
    private readonly programBlockGetter: ProgramBlockGetter,
    private readonly subjectGetter: SubjectGetter,
  ) {}

  public async handle(
    command: MoveSubjectFromProgramBlockCommand,
  ): Promise<void> {
    const currentBlock = await this.programBlockGetter.getByAdminUser(
      command.currentBlockId,
      command.adminUser,
    );

    const newBlock = await this.programBlockGetter.getByAdminUser(
      command.newBlockId,
      command.adminUser,
    );

    if (currentBlock.academicProgram.id !== newBlock.academicProgram.id) {
      throw new ProgramBlockNotFoundException();
    }

    const subjectsToMove = await Promise.all(
      command.subjectIds.map(
        async (subjectId: string) => await this.subjectGetter.get(subjectId),
      ),
    );

    this.validateSubjectsInCurrentBlock(
      command.subjectIds,
      currentBlock.subjects,
    );

    if (command.currentBlockId !== command.newBlockId) {
      await this.repository.moveSubjects(
        subjectsToMove,
        newBlock,
        currentBlock,
      );
    }
  }

  private validateSubjectsInCurrentBlock(
    subjectIds: string[],
    currentBlockSubjects: Subject[],
  ): void {
    const subjectIdsInCurrentBlock = currentBlockSubjects.map(
      (subject) => subject.id,
    );
    if (subjectIds.find((id) => !subjectIdsInCurrentBlock.includes(id))) {
      throw new SubjectNotFoundException();
    }
  }
}
