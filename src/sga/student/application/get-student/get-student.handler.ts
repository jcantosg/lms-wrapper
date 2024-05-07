import { QueryHandler } from '#shared/domain/bus/query.handler';
import { StudentGetter } from '#student/domain/service/student-getter.service';
import { GetStudentQuery } from '#student/application/get-student/get-student.query';
import { Student } from '#student/domain/entity/student.entity';

export class GetStudentHandler implements QueryHandler {
  constructor(private readonly studentGetter: StudentGetter) {}

  async handle(query: GetStudentQuery): Promise<Student> {
    return await this.studentGetter.get(query.id);
  }
}
