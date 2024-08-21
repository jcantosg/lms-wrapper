import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { GetAllStudentAdministrativeProcessesHandler } from '#student-360/administrative-process/application/get-administrative-processes/get-administrative-processes.handler';
import { AdministrativeProcessRepository } from '#student/domain/repository/administrative-process.repository';
import { UploadAdministrativeProcessHandler } from '#student-360/administrative-process/application/upload-administrative-process/upload-administrative-process.handler';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { FileManager } from '#shared/domain/file-manager/file-manager';
import { UUIDGeneratorService } from '#shared/domain/service/uuid-service';

const getStudentAdministrativeProcesses = {
  provide: GetAllStudentAdministrativeProcessesHandler,
  useFactory: (
    repository: AdministrativeProcessRepository,
    academicRecordRepository: AcademicRecordRepository,
  ): GetAllStudentAdministrativeProcessesHandler =>
    new GetAllStudentAdministrativeProcessesHandler(
      repository,
      academicRecordRepository,
    ),
  inject: [AdministrativeProcessRepository, AcademicRecordRepository],
};

const uploadAdministrativeProcess = {
  provide: UploadAdministrativeProcessHandler,
  useFactory: (
    repository: AdministrativeProcessRepository,
    academicRecordGetter: AcademicRecordGetter,
    fileManager: FileManager,
    uuidService: UUIDGeneratorService,
  ): UploadAdministrativeProcessHandler =>
    new UploadAdministrativeProcessHandler(
      repository,
      academicRecordGetter,
      fileManager,
      uuidService,
    ),
  inject: [
    AdministrativeProcessRepository,
    AcademicRecordGetter,
    FileManager,
    UUIDGeneratorService,
  ],
};

export const administrativeProcessHandlers = [
  getStudentAdministrativeProcesses,
  uploadAdministrativeProcess,
];
