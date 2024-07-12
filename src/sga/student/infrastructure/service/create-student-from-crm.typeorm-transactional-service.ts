import { CreateLmsStudentCommand } from '#/lms-wrapper/application/lms-student/create-lms-student/create-lms-student.command';
import { CreateLmsStudentHandler } from '#/lms-wrapper/application/lms-student/create-lms-student/create-lms-student.handler';
import { DeleteLmsStudentCommand } from '#/lms-wrapper/application/lms-student/delete-lms-student/delete-lms-student.command';
import { DeleteLmsStudentHandler } from '#/lms-wrapper/application/lms-student/delete-lms-student/delete-lms-student.handler';
import { PasswordEncoder } from '#shared/domain/service/password-encoder.service';
import { AdministrativeGroup } from '#student/domain/entity/administrative-group.entity';
import { InternalGroup } from '#student/domain/entity/internal-group-entity';
import {
  CreateStudentFromCRMTransactionalService,
  CreateStudentFromCRMTransactionParams,
} from '#student/domain/service/create-student-from-crm.transactional-service';
import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateLmsEnrollmentHandler } from '#lms-wrapper/application/create-lms-enrollment/create-lms-enrollment.handler';
import { DeleteLmsEnrollmentHandler } from '#lms-wrapper/application/delete-lms-enrollment/delete-lms-enrollment.handler';
import { CreateLmsEnrollmentCommand } from '#lms-wrapper/application/create-lms-enrollment/create-lms-enrollment.command';
import { DeleteLmsEnrollmentCommand } from '#lms-wrapper/application/delete-lms-enrollment/delete-lms-enrollment.command';
import { GetLmsStudentHandler } from '#lms-wrapper/application/lms-student/get-lms-student/get-lms-student.handler';
import { GetLmsStudentCommand } from '#lms-wrapper/application/lms-student/get-lms-student/get-lms-student.command';

export class CreateStudentFromCRMTypeormTransactionalService extends CreateStudentFromCRMTransactionalService {
  private logger: Logger;

  constructor(
    private readonly datasource: DataSource,
    private readonly createLmsStudentHandler: CreateLmsStudentHandler,
    private readonly deleteLmsStudentHandler: DeleteLmsStudentHandler,
    private readonly createLmsEnrollmentHandler: CreateLmsEnrollmentHandler,
    private readonly deleteLmsEnrollmentHandler: DeleteLmsEnrollmentHandler,
    private readonly passwordEncoder: PasswordEncoder,
    private readonly rawPassword: string,
    private readonly getLmsStudentHandler: GetLmsStudentHandler,
  ) {
    super();
    this.logger = new Logger(CreateStudentFromCRMTransactionalService.name);
  }

  async execute(
    entities: CreateStudentFromCRMTransactionParams,
  ): Promise<void> {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.startTransaction();
    let lmsId;
    const lmsEnrollmentsId: number[] = [];
    try {
      let lmsStudent;
      lmsStudent = await this.getLmsStudentHandler.handle(
        new GetLmsStudentCommand(
          entities.student.email,
          entities.student.universaeEmail,
        ),
      );
      if (!lmsStudent) {
        lmsStudent = await this.createLmsStudentHandler.handle(
          new CreateLmsStudentCommand(
            this.normalizeUsername(
              `${entities.student.name}-${entities.student.surname}-${entities.student.surname2}`,
            ),
            entities.student.name,
            `${entities.student.surname} ${entities.student.surname2}`,
            entities.student.email,
            this.rawPassword,
          ),
        );
        lmsId = lmsStudent.value.id;
      }
      lmsStudent.value.password = await this.passwordEncoder.encodePassword(
        this.rawPassword,
      );
      entities.student.lmsStudent = lmsStudent;
      await queryRunner.manager.save(entities.student);
      await queryRunner.manager.save(entities.academicRecord);

      for (const enrollment of entities.enrollments) {
        await queryRunner.manager.save(enrollment);
        for (const subjectCall of enrollment.calls) {
          await queryRunner.manager.save(subjectCall);
        }
        await this.createLmsEnrollmentHandler.handle(
          new CreateLmsEnrollmentCommand(
            enrollment.subject.lmsCourse!.value.id,
            enrollment.academicRecord.student.lmsStudent!.value.id,
            enrollment.academicRecord.academicPeriod.startDate,
            enrollment.academicRecord.academicPeriod.endDate,
          ),
        );
        lmsEnrollmentsId.push(enrollment.subject.lmsCourse!.value.id);
      }

      if (entities.administrativeGroup) {
        entities.administrativeGroup.addStudent(entities.student);
        await queryRunner.manager.save(AdministrativeGroup, {
          id: entities.administrativeGroup.id,
          students: entities.administrativeGroup.students,
          updatedAt: entities.administrativeGroup.updatedAt,
          updatedBy: entities.administrativeGroup.updatedBy,
        });
      }

      for (const group of entities.internalGroups) {
        await queryRunner.manager.save(InternalGroup, {
          id: group.id,
          students: group.students,
          updatedAt: group.updatedAt,
          updatedBy: group.updatedBy,
        });
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      this.logger.error(error);
      if (!!lmsId) {
        await this.deleteLmsStudentHandler.handle(
          new DeleteLmsStudentCommand(lmsId),
        );
      }
      if (lmsEnrollmentsId.length > 0 && !!lmsId) {
        for (const lmsEnrollmentId of lmsEnrollmentsId) {
          await this.deleteLmsEnrollmentHandler.handle(
            new DeleteLmsEnrollmentCommand(lmsEnrollmentId, lmsId),
          );
        }
      }
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private normalizeUsername(username: string): string {
    return username
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(' ', '-')
      .toLowerCase();
  }
}
