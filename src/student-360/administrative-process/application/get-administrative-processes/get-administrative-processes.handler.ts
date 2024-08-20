import { QueryHandler } from '#shared/domain/bus/query.handler';
import { AdministrativeProcessRepository } from '#student/domain/repository/administrative-process.repository';
import { AdministrativeProcess } from '#student/domain/entity/administrative-process.entity';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { GetAllStudentAdministrativeProcessesQuery } from '#student-360/administrative-process/application/get-administrative-processes/get-administrative-processes.query';

export class GetAllStudentAdministrativeProcessesHandler
  implements QueryHandler
{
  constructor(
    private readonly repository: AdministrativeProcessRepository,
    private readonly academicRecordRepository: AcademicRecordRepository,
  ) {}

  async handle(
    query: GetAllStudentAdministrativeProcessesQuery,
  ): Promise<AdministrativeProcess[]> {
    const academicRecords =
      await this.academicRecordRepository.getStudentOwnAcademicRecords(
        query.student.id,
      );

    const administrativeProcesses = await this.repository.getByStudent(
      query.student.id,
    );
    const academicRecordAdministrativeProcesses: AdministrativeProcess[] = [];
    for (const ar of academicRecords) {
      academicRecordAdministrativeProcesses.push(
        ...(await this.repository.getByAcademicRecord(ar.id)),
      );
    }
    administrativeProcesses.push(...academicRecordAdministrativeProcesses);

    return administrativeProcesses.reduce(
      (
        accumulator: AdministrativeProcess[],
        current: AdministrativeProcess,
      ) => {
        if (!accumulator.find((ap) => ap.id === current.id)) {
          accumulator.push(current);
        }

        return accumulator;
      },
      [],
    );
  }
}
