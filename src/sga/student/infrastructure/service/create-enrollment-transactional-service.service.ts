import {
  TransactionalService,
  TransactionParams,
} from '#shared/domain/service/transactional-service.service';
import { Enrollment } from '#student/domain/entity/enrollment.entity';
import { SubjectCall } from '#student/domain/entity/subject-call.entity';
import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

export interface CreateEnrollmentTransactionParams extends TransactionParams {
  enrollment: Enrollment;
  subjectCall: SubjectCall;
}

export class CreateEnrollmentTransactionalService extends TransactionalService {
  private logger: Logger;
  constructor(private readonly datasource: DataSource) {
    super();
    this.logger = new Logger(CreateEnrollmentTransactionalService.name);
  }

  async execute(entities: CreateEnrollmentTransactionParams): Promise<void> {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(entities.enrollment);
      await queryRunner.manager.save(entities.subjectCall);

      await queryRunner.commitTransaction();
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
