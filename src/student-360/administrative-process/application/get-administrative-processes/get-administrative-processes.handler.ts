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

  async handle(query: GetAllStudentAdministrativeProcessesQuery): Promise<{
    administrativeProcesses: AdministrativeProcess[];
    academicPeriodEnding: Date | null;
  }> {
    const [academicRecords, administrativeProcesses] = await Promise.all([
      this.academicRecordRepository.getStudentOwnAcademicRecords(
        query.student.id,
      ),
      this.repository.getByStudent(query.student.id),
    ]);

    const academicRecordAdministrativeProcesses = await Promise.all(
      academicRecords.map((ar) => this.repository.getByAcademicRecord(ar.id)),
    );

    const allAdministrativeProcesses = [
      ...administrativeProcesses.filter((ap) => !ap.academicRecord),
      ...academicRecordAdministrativeProcesses.flat(),
    ];

    const uniqueAdministrativeProcesses = Array.from(
      new Map(allAdministrativeProcesses.map((ap) => [ap.id, ap])).values(),
    );

    const academicPeriodEnding = academicRecords
      .map((record) => new Date(record.academicPeriod.endDate))
      .reduce(
        (earliest: Date, current: Date) =>
          earliest && earliest < current ? earliest : current,
        null,
      );

    return {
      administrativeProcesses: uniqueAdministrativeProcesses,
      academicPeriodEnding,
    };
  }
}
