import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { ProgramBlockGetter } from '#academic-offering/domain/service/program-block/program-block-getter.service';

export class SubjectUpToBlockGetter {
  constructor(
    private readonly academicProgramGetter: AcademicProgramGetter,
    private readonly programBlockGetter: ProgramBlockGetter,
  ) {}
  async getSubjectsUpToBlock(programBlockId: string): Promise<Subject[]> {
    const subjects: Subject[] = [];
    const programBlock = await this.programBlockGetter.get(programBlockId);
    const academicProgram = await this.academicProgramGetter.get(
      programBlock.academicProgram.id,
    );

    const programBlocks = academicProgram.programBlocks.filter(
      (block) => block.createdAt.getTime() <= programBlock.createdAt.getTime(),
    );

    programBlocks.forEach((block) => {
      subjects.push(...block.subjects);
    });

    return subjects;
  }
}
