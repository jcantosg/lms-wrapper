import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';
import { PeriodBlock } from '#academic-offering/domain/entity/period-block.entity';
import { BlockRelationRepository } from '#academic-offering/domain/repository/block-relation.repository';
import { BlockRelation } from '#academic-offering/domain/entity/block-relation.entity';
import { blockRelationSchema } from '#academic-offering/infrastructure/config/schema/block-relation.schema';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';

@Injectable()
export class BlockRelationPostgresRepository
  extends TypeOrmRepository<BlockRelation>
  implements BlockRelationRepository
{
  constructor(
    @InjectRepository(blockRelationSchema)
    private readonly repository: Repository<BlockRelation>,
  ) {
    super();
  }

  async get(id: string): Promise<BlockRelation | null> {
    return await this.repository.findOne({
      where: { id },
      relations: { periodBlock: true, programBlock: true },
    });
  }

  async save(blockRelation: BlockRelation): Promise<void> {
    await this.repository.save({
      id: blockRelation.id,
      periodBlock: blockRelation.periodBlock,
      programBlock: blockRelation.programBlock,
      createdBy: blockRelation.createdBy,
      createdAt: blockRelation.createdAt,
      updatedBy: blockRelation.updatedBy,
      updatedAt: blockRelation.updatedAt,
    });
  }

  async delete(blockRelation: BlockRelation): Promise<void> {
    await this.repository.delete(blockRelation.id);
  }

  async getByPeriodBlock(periodBlock: PeriodBlock): Promise<BlockRelation[]> {
    return await this.repository.find({
      where: { periodBlock: { id: periodBlock.id } },
      relations: { periodBlock: true, programBlock: true },
    });
  }

  async getByProgramBlock(
    programBlock: ProgramBlock,
  ): Promise<BlockRelation[]> {
    return await this.repository.find({
      where: { programBlock: { id: programBlock.id } },
      relations: { periodBlock: true, programBlock: true },
    });
  }
}
