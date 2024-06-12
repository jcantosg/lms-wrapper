import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import {
  TransferAcademicRecordTransactionalService,
  TransferAcademicRecordTransactionParams,
} from '#student/domain/service/transfer-academic-record.transactional-service';
import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

export class TransferAcademicRecordTypeormTransactionalService extends TransferAcademicRecordTransactionalService {
  private logger: Logger;

  constructor(private readonly datasource: DataSource) {
    super();
    this.logger = new Logger(TransferAcademicRecordTransactionalService.name);
  }

  async execute(
    entities: TransferAcademicRecordTransactionParams,
  ): Promise<void> {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      this.logger.log('updating old academic record');
      await queryRunner.manager.update<AcademicRecord>(
        AcademicRecord,
        { id: entities.oldAcademicRecord.id },
        { status: entities.oldAcademicRecord.status },
      );
      this.logger.log('creating new academic record');
      await queryRunner.manager.save(entities.newAcademicRecord);
      this.logger.log('creating academic record transfer');
      await queryRunner.manager.save(entities.academicRecordTransfer);

      this.logger.log('creating enrollments');
      await Promise.all([
        entities.enrollments.forEach(
          async (enrollment) => await queryRunner.manager.save(enrollment),
        ),
      ]);

      this.logger.log('done');
      await queryRunner.commitTransaction();
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
