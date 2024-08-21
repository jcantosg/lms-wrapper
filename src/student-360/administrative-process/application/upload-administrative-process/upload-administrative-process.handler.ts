import { CommandHandler } from '#shared/domain/bus/command.handler';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { FileManager } from '#shared/domain/file-manager/file-manager';
import { UUIDGeneratorService } from '#shared/domain/service/uuid-service';
import { AdministrativeProcessRepository } from '#student/domain/repository/administrative-process.repository';
import { UploadAdministrativeProcessCommand } from '#student-360/administrative-process/application/upload-administrative-process/upload-administrative-process.command';
import { AdministrativeProcessTypeEnum } from '#student/domain/enum/administrative-process-type.enum';
import { AdministrativeProcess } from '#student/domain/entity/administrative-process.entity';
import { AdministrativeProcessFile } from '#student/domain/entity/administrative-process-file';
import { InvalidAcademicRecordException } from '#shared/domain/exception/sga-student/invalid-academic-record.exception';

const BYTES_IN_MB = 1048576;

export class UploadAdministrativeProcessHandler implements CommandHandler {
  constructor(
    private readonly repository: AdministrativeProcessRepository,
    private readonly academicRecordGetter: AcademicRecordGetter,
    private readonly fileManager: FileManager,
    private uuidService: UUIDGeneratorService,
  ) {}

  async handle(command: UploadAdministrativeProcessCommand) {
    let administrativeProcess: AdministrativeProcess;
    if (
      [
        AdministrativeProcessTypeEnum.ACCESS_DOCUMENTS,
        AdministrativeProcessTypeEnum.NEW_ACADEMIC_RECORD,
      ].includes(command.type)
    ) {
      if (command.academicRecordId === null) {
        throw new InvalidAcademicRecordException();
      }
      const academicRecord = await this.academicRecordGetter.get(
        command.academicRecordId,
      );

      administrativeProcess = AdministrativeProcess.create(
        this.uuidService.generate(),
        command.type,
        command.student,
        academicRecord,
        academicRecord.businessUnit,
      );
    } else {
      administrativeProcess = AdministrativeProcess.create(
        this.uuidService.generate(),
        command.type,
        command.student,
        null,
        null,
      );
    }

    for (const file of command.files) {
      const url = await this.fileManager.uploadFile(file);
      administrativeProcess.addFile(
        new AdministrativeProcessFile({
          documentType: command.type,
          mimeType: file.contentType ?? '',
          name: file.fileName,
          url,
          size: Math.round((file.content.length / BYTES_IN_MB) * 100) / 100,
        }),
      );
    }

    await this.repository.save(administrativeProcess);
  }
}
