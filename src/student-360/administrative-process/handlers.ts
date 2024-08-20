import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { GetAllStudentAdministrativeProcessesHandler } from '#student-360/administrative-process/application/get-administrative-processes/get-administrative-processes.handler';
import { AdministrativeProcessRepository } from '#student/domain/repository/administrative-process.repository';

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

export const administrativeProcessHandlers = [
  getStudentAdministrativeProcesses,
];
