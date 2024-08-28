import { QueryHandler } from '#shared/domain/bus/query.handler';
import { Student } from '#shared/domain/entity/student.entity';
import { StudentRepository } from '#shared/domain/repository/student.repository';
import { GetStudentsByProgramsAndGroupsQuery } from '#student/application/get-students-by-programs-and-groups/get-students-by-programs-and-groups.query';

export class GetStudentsByProgramsAndGroupsHandler implements QueryHandler {
  constructor(private readonly studentRepository: StudentRepository) {}

  async handle(query: GetStudentsByProgramsAndGroupsQuery): Promise<any[]> {
    const { academicProgramIds, internalGroupIds } = query;
    const students = await this.studentRepository.getByProgramsAndGroups(
      academicProgramIds,
      internalGroupIds,
    );

    return students.reduce((accumulator: Student[], current: Student) => {
      if (!accumulator.find((student) => student.id === current.id)) {
        accumulator.push(current);
      }

      return accumulator;
    }, []);
  }
}
