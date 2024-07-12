import { CreateLmsStudentCommand } from '#/lms-wrapper/application/lms-student/create-lms-student/create-lms-student.command';
import { CreateLmsStudentHandler } from '#/lms-wrapper/application/lms-student/create-lms-student/create-lms-student.handler';
import { DeleteLmsStudentCommand } from '#/lms-wrapper/application/lms-student/delete-lms-student/delete-lms-student.command';
import { DeleteLmsStudentHandler } from '#/lms-wrapper/application/lms-student/delete-lms-student/delete-lms-student.handler';
import { PasswordEncoder } from '#shared/domain/service/password-encoder.service';
import {
  CreateStudentFromSGATransactionParams,
  CreateStudentFromSGATransactionService,
} from '#student/domain/service/create-student-from-SGA.transactional-service';
import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { stringWithoutWhitespaces } from '#shared/domain/lib/string-without-whitespaces';
import { GetLmsStudentHandler } from '#lms-wrapper/application/lms-student/get-lms-student/get-lms-student.handler';
import { GetLmsStudentCommand } from '#lms-wrapper/application/lms-student/get-lms-student/get-lms-student.command';

export class CreateStudentFromSGATyperomTransactionService extends CreateStudentFromSGATransactionService {
  private logger: Logger;

  constructor(
    private readonly datasource: DataSource,
    private readonly createLmsStudentHandler: CreateLmsStudentHandler,
    private readonly deleteLmsStudentHandler: DeleteLmsStudentHandler,
    private readonly passwordEncoder: PasswordEncoder,
    private readonly rawPassword: string,
    private readonly getLmsStudentHandler: GetLmsStudentHandler,
  ) {
    super();
    this.logger = new Logger(CreateStudentFromSGATransactionService.name);
  }

  async execute(
    entities: CreateStudentFromSGATransactionParams,
  ): Promise<void> {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.startTransaction();
    let lmsId;
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
            `${stringWithoutWhitespaces(entities.student.name)}-${
              entities.student.surname
            }-${entities.student.surname2}`.toLowerCase(),
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

      await queryRunner.commitTransaction();
    } catch (error) {
      this.logger.error(error);
      if (!!lmsId) {
        await this.deleteLmsStudentHandler.handle(
          new DeleteLmsStudentCommand(lmsId),
        );
      }
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
