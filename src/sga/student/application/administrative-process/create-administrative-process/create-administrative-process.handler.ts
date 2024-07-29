import { CommandHandler } from '#shared/domain/bus/command.handler';
import { AdministrativeProcessRepository } from '#student/domain/repository/administrative-process.repository';
import { AdministrativeProcessDocumentRepository } from '#student/domain/repository/administrative-process-document.repository';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { CreateAdministrativeProcessCommand } from '#student/application/administrative-process/create-administrative-process/create-administrative-process.command';
import { AdministrativeProcess } from '#student/domain/entity/administrative-process.entity';
import { AdministrativeProcessTypeEnum } from '#student/domain/enum/administrative-process-type.enum';
import { AdministrativeProcessDocument } from '#student/domain/entity/administrative-process-document.entity';

export class CreateAdministrativeProcessHandler implements CommandHandler {
  constructor(
    private readonly administrativeProcessRepository: AdministrativeProcessRepository,
    private readonly administrativeProcessDocumentRepository: AdministrativeProcessDocumentRepository,
    private readonly academicRecordGetter: AcademicRecordGetter,
  ) {}

  async handle(command: CreateAdministrativeProcessCommand) {
    const academicRecord = await this.academicRecordGetter.getByAdminUser(
      command.academicRecordId,
      command.adminUser,
    );

    const identityDocuments: AdministrativeProcessDocument | null =
      await this.administrativeProcessDocumentRepository.getLastIdentityDocumentsByStudent(
        command.studentId,
      );

    const administrativeProcess = AdministrativeProcess.create(
      command.id,
      AdministrativeProcessTypeEnum.NEW_ACADEMIC_RECORD,
      academicRecord,
      command.adminUser,
      identityDocuments,
    );

    await this.administrativeProcessRepository.save(administrativeProcess);
  }
}
