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
import { AdministrativeProcessStatusEnum } from '#student/domain/enum/administrative-process-status.enum';
import { InvalidAdministrativeProcessStatusException } from '#shared/domain/exception/student-360/administrative-process.invalid-status.exception';

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
        AdministrativeProcessTypeEnum.ACADEMIC_RECOGNITION,
        AdministrativeProcessTypeEnum.RESIGNATION,
      ].includes(command.type)
    ) {
      if (command.academicRecordId === null) {
        throw new InvalidAcademicRecordException();
      }
      const academicRecord = await this.academicRecordGetter.get(
        command.academicRecordId,
      );

      const existingAdminProcesses = await this.repository.getByAcademicRecord(
        academicRecord.id,
      );

      const existingAccessDocuments = existingAdminProcesses.find(
        (ap) => ap.type === AdministrativeProcessTypeEnum.ACCESS_DOCUMENTS,
      );

      const existingAcademicRecognition = existingAdminProcesses.find(
        (ap) => ap.type === AdministrativeProcessTypeEnum.ACADEMIC_RECOGNITION,
      );

      const existingResignation = existingAdminProcesses.find(
        (ap) => ap.type === AdministrativeProcessTypeEnum.RESIGNATION,
      );

      if (
        (existingAccessDocuments &&
          command.type === AdministrativeProcessTypeEnum.ACCESS_DOCUMENTS &&
          [
            AdministrativeProcessStatusEnum.DOCUMENT_VALIDATED,
            AdministrativeProcessStatusEnum.PENDING_VALIDATION,
          ].includes(existingAccessDocuments.status)) ||
        (existingAcademicRecognition &&
          command.type === AdministrativeProcessTypeEnum.ACADEMIC_RECOGNITION &&
          [
            AdministrativeProcessStatusEnum.DOCUMENT_VALIDATED,
            AdministrativeProcessStatusEnum.PENDING_VALIDATION,
          ].includes(existingAcademicRecognition.status)) ||
        (existingResignation &&
          command.type === AdministrativeProcessTypeEnum.RESIGNATION &&
          [
            AdministrativeProcessStatusEnum.DOCUMENT_VALIDATED,
            AdministrativeProcessStatusEnum.PENDING_VALIDATION,
          ].includes(existingResignation.status))
      ) {
        throw new InvalidAdministrativeProcessStatusException();
      }

      switch (command.type) {
        case AdministrativeProcessTypeEnum.ACCESS_DOCUMENTS:
          administrativeProcess =
            existingAccessDocuments ??
            AdministrativeProcess.create(
              this.uuidService.generate(),
              command.type,
              command.student,
              academicRecord,
              academicRecord.businessUnit,
            );
          break;
        case AdministrativeProcessTypeEnum.ACADEMIC_RECOGNITION:
          administrativeProcess =
            existingAcademicRecognition ??
            AdministrativeProcess.create(
              this.uuidService.generate(),
              command.type,
              command.student,
              academicRecord,
              academicRecord.businessUnit,
            );
          break;
        case AdministrativeProcessTypeEnum.RESIGNATION:
          administrativeProcess =
            existingResignation ??
            AdministrativeProcess.create(
              this.uuidService.generate(),
              command.type,
              command.student,
              academicRecord,
              academicRecord.businessUnit,
            );
          break;
        default:
          administrativeProcess = AdministrativeProcess.create(
            this.uuidService.generate(),
            command.type,
            command.student,
            academicRecord,
            academicRecord.businessUnit,
          );
      }
    } else {
      const existingAdminProcesses = await this.repository.getByStudent(
        command.student.id,
      );

      const existingDocument = existingAdminProcesses.find(
        (ap) => ap.type === command.type,
      );

      if (
        existingDocument &&
        [
          AdministrativeProcessStatusEnum.DOCUMENT_VALIDATED,
          AdministrativeProcessStatusEnum.PENDING_VALIDATION,
        ].includes(existingDocument.status)
      ) {
        throw new InvalidAdministrativeProcessStatusException();
      }

      administrativeProcess =
        existingDocument ??
        AdministrativeProcess.create(
          this.uuidService.generate(),
          command.type,
          command.student,
          null,
          null,
        );
    }
    administrativeProcess.files = [];
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

    administrativeProcess.status =
      AdministrativeProcessStatusEnum.PENDING_VALIDATION;
    await this.repository.save(administrativeProcess);
  }
}
