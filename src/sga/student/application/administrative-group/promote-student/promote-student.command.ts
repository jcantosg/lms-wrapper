import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';

export class PromoteStudentCommand {
  constructor(
    public readonly academicRecordId: string,
    public readonly studentId: string,
    public readonly programBlock: ProgramBlock,
  ) {}
}
