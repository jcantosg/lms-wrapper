import { InternalGroup } from '#student/domain/entity/internal-group.entity';
import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DeleteLmsEnrollmentHandler } from '#lms-wrapper/application/delete-lms-enrollment/delete-lms-enrollment.handler';
import { CreateLmsEnrollmentCommand } from '#lms-wrapper/application/create-lms-enrollment/create-lms-enrollment.command';
import { DeleteLmsEnrollmentCommand } from '#lms-wrapper/application/delete-lms-enrollment/delete-lms-enrollment.command';
import { AdministrativeGroup } from '#student/domain/entity/administrative-group.entity';
import {
  CancelAcademicRecordTransactionalService,
  CancelAcademicRecordTransactionParams,
} from '#student/domain/service/cancel-academic-record.transactional-service';
import { CreateLmsEnrollmentHandler } from '#lms-wrapper/application/create-lms-enrollment/create-lms-enrollment.handler';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class CancelAcademicRecordTypeormTransactionalService extends CancelAcademicRecordTransactionalService {
  private logger: Logger;

  constructor(
    private readonly datasource: DataSource,
    private readonly createLmsEnrollmentHandler: CreateLmsEnrollmentHandler,
    private readonly deleteLmsEnrollmentHandler: DeleteLmsEnrollmentHandler,
  ) {
    super();
    this.logger = new Logger(CancelAcademicRecordTransactionalService.name);
  }

  async execute(
    entities: CancelAcademicRecordTransactionParams,
  ): Promise<void> {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.startTransaction();
    const enrollmentIds: number[] = [];
    try {
      this.logger.log('cancel academic record');
      await queryRunner.manager.save(AcademicRecord, {
        id: entities.academicRecord.id,
        status: entities.academicRecord.status,
        modality: entities.academicRecord.modality,
        isModular: entities.academicRecord.isModular,
        updatedAt: entities.academicRecord.updatedAt,
        updatedBy: entities.academicRecord.updatedBy,
      });

      this.logger.log('remove student from administrative group');
      if (entities.administrativeGroup) {
        await queryRunner.manager.save(AdministrativeGroup, {
          id: entities.administrativeGroup.id,
          students: entities.administrativeGroup.students,
          updatedAt: entities.administrativeGroup.updatedAt,
          updatedBy: entities.administrativeGroup.updatedBy,
          studentsNumber: entities.administrativeGroup.studentsNumber,
        });
      }

      this.logger.log('remove student from internal groups');
      for (const group of entities.internalGroups) {
        await queryRunner.manager.save(InternalGroup, {
          id: group.id,
          students: group.students,
          updatedAt: group.updatedAt,
          updatedBy: group.updatedBy,
        });
      }

      this.logger.log('cancel lms enrollments');
      for (const enrollment of entities.enrollments) {
        await this.deleteLmsEnrollmentHandler.handle(
          new DeleteLmsEnrollmentCommand(
            enrollment.lmsEnrollment!.value.courseId,
            enrollment.academicRecord.student.lmsStudent!.value.id,
          ),
        );
        enrollmentIds.push(enrollment.subject.lmsCourse!.value.id);
      }

      this.logger.log('done');
      await queryRunner.commitTransaction();
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();

      if (enrollmentIds.length > 0) {
        for (const enrollment of enrollmentIds) {
          await this.createLmsEnrollmentHandler.handle(
            new CreateLmsEnrollmentCommand(
              enrollment,
              entities.academicRecord.student.lmsStudent!.value.id,
              entities.academicRecord.academicPeriod.startDate,
              entities.academicRecord.academicPeriod.endDate,
            ),
          );
        }
      }

      throw new ConflictException();
    } finally {
      await queryRunner.release();
    }
  }
}
