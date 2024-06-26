import { CreateLmsStudentCommand } from '#/lms-wrapper/application/create-lms-student/create-lms-student.command';
import { CreateLmsStudentHandler } from '#/lms-wrapper/application/create-lms-student/create-lms-student.handler';
import { DeleteLmsStudentCommand } from '#/lms-wrapper/application/delete-lms-student/delete-lms-student.command';
import { DeleteLmsStudentHandler } from '#/lms-wrapper/application/delete-lms-student/delete-lms-student.handler';
import { PasswordEncoder } from '#shared/domain/service/password-encoder.service';
import {
  CreateStudentFromCRMTransactionParams,
  CreateStudentFromCRMTransactionalService,
} from '#student/domain/service/create-student-from-crm.transactional-service';
import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

export class CreateStudentFromCRMTypeormTransactionalService extends CreateStudentFromCRMTransactionalService {
  private logger: Logger;
  constructor(
    private readonly datasource: DataSource,
    private readonly createLmsStudentHandler: CreateLmsStudentHandler,
    private readonly deleteLmsStudentHandler: DeleteLmsStudentHandler,
    private readonly passwordEncoder: PasswordEncoder,
    private readonly rawPassword: string,
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
    try {
      const lmsStudent = await this.createLmsStudentHandler.handle(
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
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      this.logger.error(error);
      await this.deleteLmsStudentHandler.handle(
        new DeleteLmsStudentCommand(lmsId!),
      );
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
