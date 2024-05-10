import { DataSource } from 'typeorm';
import {
  CreateAcademicProgramTransactionParams,
  CreateAcademicProgramTransactionService,
} from '#academic-offering/domain/service/academic-program/create-academic-program.transactional-service';

export class CreateAcademicProgramTyperomTransactionService extends CreateAcademicProgramTransactionService {
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
