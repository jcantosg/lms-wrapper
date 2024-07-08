import {
  TransactionalService,
  TransactionParams,
} from '#shared/domain/service/transactional-service.service';
import { Enrollment } from '#student/domain/entity/enrollment.entity';
import { InternalGroup } from '#student/domain/entity/internal-group-entity';
import { SubjectCall } from '#student/domain/entity/subject-call.entity';
import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

export interface CreateEnrollmentTransactionParams extends TransactionParams {
  enrollment: Enrollment;
  subjectCall: SubjectCall;
  internalGroup: InternalGroup;
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

      await queryRunner.manager.save(InternalGroup, {
        id: entities.internalGroup.id,
        academicPeriod: entities.internalGroup.academicPeriod,
        academicProgram: entities.internalGroup.academicProgram,
        businessUnit: entities.internalGroup.businessUnit,
        code: entities.internalGroup.code,
        createdAt: entities.internalGroup.createdAt,
        isDefault: entities.internalGroup.isDefault,
        periodBlock: entities.internalGroup.periodBlock,
        students: entities.internalGroup.students,
        subject: entities.internalGroup.subject,
        teachers: entities.internalGroup.teachers,
        updatedAt: entities.internalGroup.updatedAt,
        createdBy: entities.internalGroup.createdBy,
        updatedBy: entities.internalGroup.updatedBy,
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
