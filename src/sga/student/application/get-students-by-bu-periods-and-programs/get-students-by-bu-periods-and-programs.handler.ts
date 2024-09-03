import { QueryHandler } from '#shared/domain/bus/query.handler';
import { StudentRepository } from '#shared/domain/repository/student.repository';
import { GetStudentsByBuPeriodsAndProgramsQuery } from '#student/application/get-students-by-bu-periods-and-programs/get-students-by-bu-periods-and-programs.query';

export class GetStudentsByBuPeriodsAndProgramsHandler implements QueryHandler {
  constructor(private readonly studentRepository: StudentRepository) {}

  async handle(query: GetStudentsByBuPeriodsAndProgramsQuery): Promise<any[]> {
    const { businessUnitIds, academicPeriodIds, academicProgramIds } = query;
    const students = await this.studentRepository.findByBuPeriodsAndPrograms(
      businessUnitIds,
      academicPeriodIds,
      academicProgramIds,
    );

    return Array.from(new Set(students));
  }
}
