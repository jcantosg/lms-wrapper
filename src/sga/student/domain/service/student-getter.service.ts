import { StudentRepository } from '#student/domain/repository/student.repository';
import { StudentNotFoundException } from '#student/shared/exception/student-not-found.exception';

export class StudentGetter {
  constructor(private readonly repository: StudentRepository) {}

  async get(id: string) {
    const student = await this.repository.get(id);
    if (!student) {
      throw new StudentNotFoundException();
    }

    return student;
  }
}
