import { DataSource } from 'typeorm';
import {
  CreateAcademicProgramTransactionParams,
  CreateAcademicProgramTransactionService,
} from '#academic-offering/domain/service/academic-program/create-academic-program.transactional-service';
import { Logger } from '@nestjs/common';

export class CreateAcademicProgramTyperomTransactionService extends CreateAcademicProgramTransactionService {
  private logger: Logger;
  constructor(private readonly datasource: DataSource) {
    super();
    this.logger = new Logger(CreateAcademicProgramTransactionService.name);
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
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
