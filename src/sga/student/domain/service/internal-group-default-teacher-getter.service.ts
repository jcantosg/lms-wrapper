import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { InternalGroupNotFoundException } from '#shared/domain/exception/internal-group/internal-group.not-found.exception';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';

export class InternalGroupDefaultTeacherGetter {
  constructor(private readonly repository: InternalGroupRepository) {}

  async get(studentId: string, subjectId: string): Promise<EdaeUser | null> {
    const internalGroup = await this.repository.getByStudentAndSubject(
      studentId,
      subjectId,
    );
    if (!internalGroup) {
      throw new InternalGroupNotFoundException();
    }

    return internalGroup.defaultTeacher;
  }
}
