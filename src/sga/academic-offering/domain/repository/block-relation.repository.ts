import { BlockRelation } from '#academic-offering/domain/entity/block-relation.entity';
import { PeriodBlock } from '#academic-offering/domain/entity/period-block.entity';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';

export abstract class BlockRelationRepository {
  abstract save(blockRelation: BlockRelation): Promise<void>;
  abstract get(id: string): Promise<BlockRelation | null>;
  abstract delete(blockRelation: BlockRelation): Promise<void>;
  abstract getByPeriodBlock(periodBlock: PeriodBlock): Promise<BlockRelation[]>;
  abstract getByProgramBlock(
    programBlock: ProgramBlock,
  ): Promise<BlockRelation[]>;
  abstract getByProgramBlockAndAcademicPeriod(
    programBlock: ProgramBlock,
    academicPeriod: AcademicPeriod,
  ): Promise<BlockRelation | null>;
}
