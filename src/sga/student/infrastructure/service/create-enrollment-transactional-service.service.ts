import { Student } from '#shared/domain/entity/student.entity';
import {
  TransactionalService,
  TransactionParams,
} from '#shared/domain/service/transactional-service.service';
import { Enrollment } from '#student/domain/entity/enrollment.entity';
import { InternalGroup } from '#student/domain/entity/internal-group-entity';
import { SubjectCall } from '#student/domain/entity/subject-call.entity';
import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { LmsEnrollment } from '#lms-wrapper/domain/entity/lms-enrollment';
import { CreateLmsEnrollmentCommand } from '#lms-wrapper/application/create-lms-enrollment/create-lms-enrollment.command';
import { CreateLmsEnrollmentHandler } from '#lms-wrapper/application/create-lms-enrollment/create-lms-enrollment.handler';
import { DeleteLmsEnrollmentHandler } from '#lms-wrapper/application/delete-lms-enrollment/delete-lms-enrollment.handler';
import { DeleteLmsEnrollmentCommand } from '#lms-wrapper/application/delete-lms-enrollment/delete-lms-enrollment.command';
import { ConflictException } from '#shared/domain/exception/conflict.exception';

export interface CreateEnrollmentTransactionParams extends TransactionParams {
  enrollment: Enrollment;
  subjectCall: SubjectCall;
  internalGroup: InternalGroup;
  student: Student;
}

export class CreateEnrollmentTransactionalService extends TransactionalService {
  private logger: Logger;

  constructor(
    private readonly datasource: DataSource,
    private readonly createLmsEnrollmentHandler: CreateLmsEnrollmentHandler,
    private readonly deleteLmsEnrollmentHandler: DeleteLmsEnrollmentHandler,
  ) {
    super();
    this.logger = new Logger(CreateEnrollmentTransactionalService.name);
  }

  async execute(entities: CreateEnrollmentTransactionParams): Promise<void> {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      if (
        !entities.enrollment.academicRecord.student.lmsStudent &&
        !entities.enrollment.subject.lmsCourse
      ) {
        this.handleError();
      }

      const lmsEnrollment = new LmsEnrollment({
        courseId: entities.enrollment.subject.lmsCourse!.value.id,
        studentId:
          entities.enrollment.academicRecord.student.lmsStudent!.value.id,
        startDate: Math.floor(
          entities.enrollment.academicRecord.academicPeriod.startDate.getTime() /
            1000.0,
        ),
        endDate: Math.floor(
          entities.enrollment.academicRecord.academicPeriod.endDate.getTime() /
            1000.0,
        ),
      });
      await this.createLmsEnrollmentHandler.handle(
        new CreateLmsEnrollmentCommand(
          lmsEnrollment.value.courseId,
          lmsEnrollment.value.studentId,
          entities.enrollment.academicRecord.academicPeriod.startDate,
          entities.enrollment.academicRecord.academicPeriod.endDate,
        ),
      );
      entities.enrollment.lmsEnrollment = lmsEnrollment;
      await queryRunner.manager.save(entities.enrollment);
      await queryRunner.manager.save(entities.subjectCall);

      entities.internalGroup.addStudents([entities.student]);
      await queryRunner.manager.save(InternalGroup, {
        id: entities.internalGroup.id,
        students: entities.internalGroup.students,
        updatedAt: entities.internalGroup.updatedAt,
        updatedBy: entities.internalGroup.updatedBy,
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
      await this.deleteLmsEnrollmentHandler.handle(
        new DeleteLmsEnrollmentCommand(
          entities.enrollment.subject.lmsCourse!.value.id,
          entities.enrollment.academicRecord.student.lmsStudent!.value.id,
        ),
      );
    } finally {
      await queryRunner.release();
    }
  }

  private handleError() {
    throw new ConflictException();
  }
}
