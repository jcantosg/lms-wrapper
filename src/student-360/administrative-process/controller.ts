import { GetAllStudentAdministrativeProcessesController } from '#student-360/administrative-process/infrastructure/controller/administrative-process/get-administrative-processes.controller';
import { UploadAdministrativeProcessController } from '#student-360/administrative-process/infrastructure/controller/administrative-process/upload-administrative-process.controller';

export const administrativeProcessControllers = [
  GetAllStudentAdministrativeProcessesController,
  UploadAdministrativeProcessController,
];
