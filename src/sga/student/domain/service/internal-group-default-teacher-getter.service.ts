import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';

export class InternalGroupDefaultTeacherGetter {
  constructor(private readonly repository: InternalGroupRepository) {}

  async get(studentId: string, subjectId: string): Promise<EdaeUser | null> {
    const internalGroup = await this.repository.getByStudentAndSubject(
      studentId,
      subjectId,
    );

    return internalGroup ? internalGroup.defaultTeacher : null;
  }
}
