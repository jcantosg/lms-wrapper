import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { GetAllStudentAdministrativeProcessesHandler } from '#student-360/administrative-process/application/get-administrative-processes/get-administrative-processes.handler';
import { AdministrativeProcessRepository } from '#student/domain/repository/administrative-process.repository';
import { UploadAdministrativeProcessHandler } from '#student-360/administrative-process/application/upload-administrative-process/upload-administrative-process.handler';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { FileManager } from '#shared/domain/file-manager/file-manager';
import { UUIDGeneratorService } from '#shared/domain/service/uuid-service';
import { GetResignationApplicationHandler } from '#student-360/administrative-process/application/get-resignation-application/get-resignation-application.handler';
import { GetAcademicRecognitionApplicationHandler } from '#student-360/administrative-process/application/get-academic-recognition-application/get-academic-recognition-application.handler';
import { ConfigService } from '@nestjs/config';

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

const getResignationApplicationHandler = {
  provide: GetResignationApplicationHandler,
  useFactory: (
    academicRecordRepository: AcademicRecordRepository,
    configService: ConfigService,
  ): GetResignationApplicationHandler =>
    new GetResignationApplicationHandler(
      academicRecordRepository,
      configService.getOrThrow('MEDIA_DOMAIN_NAME'),
    ),
  inject: [AcademicRecordRepository, ConfigService],
};

const getAcademicRecognitionApplicationHandler = {
  provide: GetAcademicRecognitionApplicationHandler,
  useFactory: (
    academicRecordRepository: AcademicRecordRepository,
    configService: ConfigService,
  ): GetAcademicRecognitionApplicationHandler =>
    new GetAcademicRecognitionApplicationHandler(
      academicRecordRepository,
      configService.getOrThrow('MEDIA_DOMAIN_NAME'),
    ),
  inject: [AcademicRecordRepository, ConfigService],
};

export const administrativeProcessHandlers = [
  getStudentAdministrativeProcesses,
  uploadAdministrativeProcess,
  getResignationApplicationHandler,
  getAcademicRecognitionApplicationHandler,
];
