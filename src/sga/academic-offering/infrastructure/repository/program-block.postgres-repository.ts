import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { programBlockSchema } from '#academic-offering/infrastructure/config/schema/program-block.schema';
import { ProgramBlockRepository } from '#academic-offering/domain/repository/program-block.repository';
import { Subject } from '#academic-offering/domain/entity/subject.entity';

@Injectable()
export class ProgramBlockPostgresRepository
  extends TypeOrmRepository<ProgramBlock>
  implements ProgramBlockRepository
{
  constructor(
    @InjectRepository(programBlockSchema)
    private readonly repository: Repository<ProgramBlock>,
  ) {
    super();
  }

  async existsById(id: string): Promise<boolean> {
    const programBlock = await this.repository.findOne({ where: { id } });

    return !!programBlock;
  }

  async get(id: string): Promise<ProgramBlock | null> {
    return await this.repository.findOne({
      where: { id },
      relations: {
        academicProgram: {
          businessUnit: true,
        },
        subjects: true,
      },
    });
  }

  private initializeQueryBuilder(aliasQuery: string) {
    const queryBuilder = this.repository.createQueryBuilder(aliasQuery);

    queryBuilder.leftJoinAndSelect(
      `${aliasQuery}.academicProgram`,
      'academicProgram',
    );
    queryBuilder.leftJoinAndSelect(
      'academicProgram.businessUnit',
      'businessUnit',
    );
    queryBuilder.leftJoinAndSelect(`${aliasQuery}.subjects`, 'subject');

    return queryBuilder;
  }

  async getByAdminUser(
    programBlockId: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<ProgramBlock | null> {
    if (isSuperAdmin) {
      return await this.get(programBlockId);
    }

    adminUserBusinessUnits = this.normalizeAdminUserBusinessUnits(
      adminUserBusinessUnits,
    );
    const queryBuilder = this.initializeQueryBuilder('programBlock');

    return await queryBuilder
      .where('programBlock.id = :id', { id: programBlockId })
      .andWhere('academicProgram.businessUnit.id IN(:...ids)', {
        ids: adminUserBusinessUnits,
      })
      .getOne();
  }

  async save(programBlock: ProgramBlock): Promise<void> {
    await this.repository.save({
      id: programBlock.id,
      name: programBlock.name,
      academicProgram: programBlock.academicProgram,
      subjects: programBlock.subjects,
      createdBy: programBlock.createdBy,
      createdAt: programBlock.createdAt,
      updatedBy: programBlock.updatedBy,
      updatedAt: programBlock.updatedAt,
    });
  }

  async delete(programBlock: ProgramBlock): Promise<void> {
    await this.repository.delete(programBlock.id);
  }

  async moveSubjects(
    subjectsToMove: Subject[],
    newBlock: ProgramBlock,
    currentBlock: ProgramBlock,
  ): Promise<void> {
    const subjectsToKeep = currentBlock.subjects.filter(
      (currentBlockSubject) =>
        !subjectsToMove.some(
          (subjectToMove) => currentBlockSubject.id === subjectToMove.id,
        ),
    );
    currentBlock.subjects = subjectsToKeep;
    newBlock.subjects = [...newBlock.subjects, ...subjectsToMove];
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(ProgramBlock, {
        id: currentBlock.id,
        subjects: currentBlock.subjects,
      });
      await queryRunner.manager.save(ProgramBlock, {
        id: newBlock.id,
        subjects: newBlock.subjects,
      });
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
    } finally {
      await queryRunner.release();
    }
  }
}
