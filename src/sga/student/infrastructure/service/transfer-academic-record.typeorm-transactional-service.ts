import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { Enrollment } from '#student/domain/entity/enrollment.entity';
import { InternalGroup } from '#student/domain/entity/internal-group.entity';
import { SubjectCall } from '#student/domain/entity/subject-call.entity';
import {
  TransferAcademicRecordTransactionalService,
  TransferAcademicRecordTransactionParams,
} from '#student/domain/service/transfer-academic-record.transactional-service';
import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateLmsEnrollmentHandler } from '#lms-wrapper/application/create-lms-enrollment/create-lms-enrollment.handler';
import { DeleteLmsEnrollmentHandler } from '#lms-wrapper/application/delete-lms-enrollment/delete-lms-enrollment.handler';
import { CreateLmsEnrollmentCommand } from '#lms-wrapper/application/create-lms-enrollment/create-lms-enrollment.command';
import { DeleteLmsEnrollmentCommand } from '#lms-wrapper/application/delete-lms-enrollment/delete-lms-enrollment.command';
import { AdministrativeGroup } from '#student/domain/entity/administrative-group.entity';
import { LmsEnrollment } from '#lms-wrapper/domain/entity/lms-enrollment';

export class TransferAcademicRecordTypeormTransactionalService extends TransferAcademicRecordTransactionalService {
  private logger: Logger;

  constructor(
    private readonly datasource: DataSource,
    private readonly createLmsEnrollmentHandler: CreateLmsEnrollmentHandler,
    private readonly deleteLmsEnrollmentHandler: DeleteLmsEnrollmentHandler,
  ) {
    super();
    this.logger = new Logger(TransferAcademicRecordTransactionalService.name);
  }

  async execute(
    entities: TransferAcademicRecordTransactionParams,
  ): Promise<void> {
    const queryRunner = this.datasource.createQueryRunner();
    const newEnrollmentIds: number[] = [];
    const oldEnrollmentIds: number[] = [];
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

      for (const enrollment of entities.enrollments) {
        const lmsEnrollment = new LmsEnrollment({
          courseId: enrollment.subject.lmsCourse!.value.id,
          studentId: entities.newAcademicRecord.student.lmsStudent!.value.id,
          startDate: Math.floor(
            enrollment.academicRecord.academicPeriod.startDate.getTime() /
              1000.0,
          ),
          endDate: Math.floor(
            enrollment.academicRecord.academicPeriod.endDate.getTime() / 1000.0,
          ),
        });
        enrollment.lmsEnrollment = lmsEnrollment;
        await queryRunner.manager.save<Enrollment>(enrollment);
        for (const call of enrollment.calls) {
          await queryRunner.manager.save<SubjectCall>(call);
        }
        await this.createLmsEnrollmentHandler.handle(
          new CreateLmsEnrollmentCommand(
            lmsEnrollment.value.courseId,
            lmsEnrollment.value.studentId,
            enrollment.academicRecord.academicPeriod.startDate,
            enrollment.academicRecord.academicPeriod.endDate,
          ),
        );
        newEnrollmentIds.push(enrollment.subject.lmsCourse!.value.id);
      }
      for (const oldEnrollment of entities.oldEnrollments) {
        await this.deleteLmsEnrollmentHandler.handle(
          new DeleteLmsEnrollmentCommand(
            oldEnrollment.lmsEnrollment!.value.courseId,
            oldEnrollment.academicRecord.student.lmsStudent!.value.id,
          ),
        );
        oldEnrollmentIds.push(oldEnrollment.lmsEnrollment!.value.courseId);
      }

      this.logger.log('updating administrative groups');
      for (const group of entities.administrativeGroups) {
        await queryRunner.manager.save(AdministrativeGroup, {
          id: group.id,
          students: group.students,
          updatedAt: group.updatedAt,
          updatedBy: group.updatedBy,
          studentsNumber: group.studentsNumber,
        });
      }

      this.logger.log('updating internal groups');
      for (const group of entities.internalGroups) {
        await queryRunner.manager.save(InternalGroup, {
          id: group.id,
          students: group.students,
          updatedAt: group.updatedAt,
          updatedBy: group.updatedBy,
        });
      }

      this.logger.log('done');
      await queryRunner.commitTransaction();
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
      if (newEnrollmentIds.length > 0) {
        for (const newEnrollment of newEnrollmentIds) {
          await this.deleteLmsEnrollmentHandler.handle(
            new DeleteLmsEnrollmentCommand(
              newEnrollment,
              entities.newAcademicRecord.student.lmsStudent!.value.id,
            ),
          );
        }
      }
      if (oldEnrollmentIds.length > 0) {
        for (const oldEnrollment of oldEnrollmentIds) {
          await this.createLmsEnrollmentHandler.handle(
            new CreateLmsEnrollmentCommand(
              oldEnrollment,
              entities.oldAcademicRecord.student.lmsStudent!.value.id,
              entities.oldAcademicRecord.academicPeriod.startDate,
              entities.oldAcademicRecord.academicPeriod.endDate,
            ),
          );
        }
      }
    } finally {
      await queryRunner.release();
    }
  }
}
