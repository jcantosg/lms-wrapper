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
import { CreateChatUserHandler } from '#shared/application/create-chat-user/create-chat-user.handler';
import { CreateChatUserCommand } from '#shared/application/create-chat-user/create-chat-user.command';
import { DeleteChatUserHandler } from '#shared/application/delete-chat-user/delete-chat-user.handler';
import { DeleteChatUserCommand } from '#shared/application/delete-chat-user/delete-chat-user.command';
import { ExistChatUserHandler } from '#shared/application/exist-chat-user/exist-chat-user.handler';
import { ExistChatUserQuery } from '#shared/application/exist-chat-user/exist-chat-user.query';

export class CreateStudentFromSGATyperomTransactionService extends CreateStudentFromSGATransactionService {
  private logger: Logger;

  constructor(
    private readonly datasource: DataSource,
    private readonly createLmsStudentHandler: CreateLmsStudentHandler,
    private readonly deleteLmsStudentHandler: DeleteLmsStudentHandler,
    private readonly passwordEncoder: PasswordEncoder,
    private readonly rawPassword: string,
    private readonly getLmsStudentHandler: GetLmsStudentHandler,
    private readonly createChatUserHandler: CreateChatUserHandler,
    private readonly deleteChatUserHandler: DeleteChatUserHandler,
    private readonly existChatUserHandler: ExistChatUserHandler,
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
      if (
        !(await this.existChatUserHandler.handle(
          new ExistChatUserQuery(entities.student.email),
        ))
      ) {
        await this.createChatUserHandler.handle(
          new CreateChatUserCommand(
            entities.student.id,
            entities.student.universaeEmail,
            this.rawPassword,
            `${entities.student.name} ${entities.student.surname}`,
          ),
        );
      }

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
            }-${entities.student.id}`.toLowerCase(),
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
      if (
        await this.existChatUserHandler.handle(
          new ExistChatUserQuery(entities.student.email),
        )
      ) {
        await this.deleteChatUserHandler.handle(
          new DeleteChatUserCommand(entities.student.id),
        );
      }

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
