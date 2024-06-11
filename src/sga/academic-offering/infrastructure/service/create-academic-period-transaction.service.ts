import { DataSource } from 'typeorm';
import {
  CreateAcademicPeriodTransactionParams,
  CreateAcademicPeriodTransactionService,
} from '#academic-offering/domain/service/academic-program/create-academic-period.transactional-service';
import { Logger } from '@nestjs/common';

export class CreateAcademicPeriodTyperomTransactionService extends CreateAcademicPeriodTransactionService {
  private logger: Logger;
  constructor(private readonly datasource: DataSource) {
    super();
    this.logger = new Logger(CreateAcademicPeriodTransactionService.name);
  }

  async execute(
    entities: CreateAcademicPeriodTransactionParams,
  ): Promise<void> {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(entities.academicPeriod);
      for (const periodBlock of entities.periodBlocks) {
        await queryRunner.manager.save(periodBlock);
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
