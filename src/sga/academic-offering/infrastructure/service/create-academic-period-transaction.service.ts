import { DataSource } from 'typeorm';
import {
  CreateAcademicPeriodTransactionParams,
  CreateAcademicPeriodTransactionService,
} from '#academic-offering/domain/service/academic-program/create-academic-period.transactional-service';

export class CreateAcademicPeriodTyperomTransactionService extends CreateAcademicPeriodTransactionService {
  constructor(private readonly datasource: DataSource) {
    super();
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
      console.log(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
