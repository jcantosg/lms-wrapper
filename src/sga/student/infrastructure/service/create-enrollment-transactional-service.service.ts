import {
  TransactionalService,
  TransactionParams,
} from '#shared/domain/service/transactional-service.service';
import { Enrollment } from '#student/domain/entity/enrollment.entity';
import { SubjectCall } from '#student/domain/entity/subject-call.entity';
import { DataSource } from 'typeorm';

export interface CreateEnrollmentTransactionParams extends TransactionParams {
  enrollment: Enrollment;
  subjectCall: SubjectCall;
}

export class CreateEnrollmentTransactionalService extends TransactionalService {
  constructor(private readonly datasource: DataSource) {
    super();
  }

  async execute(entities: CreateEnrollmentTransactionParams): Promise<void> {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(entities.enrollment);
      await queryRunner.manager.save(entities.subjectCall);

      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
