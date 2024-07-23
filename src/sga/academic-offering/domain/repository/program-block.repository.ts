import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { Subject } from '#academic-offering/domain/entity/subject.entity';

export abstract class ProgramBlockRepository {
  abstract existsById(id: string): Promise<boolean>;

  abstract save(programBlock: ProgramBlock): Promise<void>;

  abstract get(id: string): Promise<ProgramBlock | null>;

  abstract getFirstBlockByProgram(
    academicProgram: AcademicProgram,
  ): Promise<ProgramBlock | null>;

  abstract getByAdminUser(
    id: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<ProgramBlock | null>;

  abstract delete(programBlock: ProgramBlock): Promise<void>;

  abstract moveSubjects(
    subjectsToMove: Subject[],
    newBlock: ProgramBlock,
    currentBlock: ProgramBlock,
  ): Promise<void>;
}
