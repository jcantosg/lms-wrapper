import {
  TransactionalService,
  TransactionParams,
} from '#shared/domain/service/transactional-service.service';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { DataSource } from 'typeorm';

export interface CreateAcademicProgramTransactionParams
  extends TransactionParams {
  academicProgram: AcademicProgram;
  programBlocks: ProgramBlock[];
}

export class CreateAcademicProgramTransactionService extends TransactionalService {
  constructor(private readonly datasource: DataSource) {
    super();
  }

  async execute(
    entities: CreateAcademicProgramTransactionParams,
  ): Promise<void> {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(entities.academicProgram);
      for (const programBlock of entities.programBlocks) {
        await queryRunner.manager.save(programBlock);
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
