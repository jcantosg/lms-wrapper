import { GetAcademicRecognitionApplicationController } from '#student-360/administrative-process/infrastructure/controller/administrative-process/get-academic-recognition-application.controller';
import { GetAllStudentAdministrativeProcessesController } from '#student-360/administrative-process/infrastructure/controller/administrative-process/get-administrative-processes.controller';
import { GetResignationApplicationController } from '#student-360/administrative-process/infrastructure/controller/administrative-process/get-resignation-application.controller';
import { UploadAdministrativeProcessController } from '#student-360/administrative-process/infrastructure/controller/administrative-process/upload-administrative-process.controller';

export const administrativeProcessControllers = [
  GetResignationApplicationController,
  GetAcademicRecognitionApplicationController,
  GetAllStudentAdministrativeProcessesController,
  UploadAdministrativeProcessController,
];
