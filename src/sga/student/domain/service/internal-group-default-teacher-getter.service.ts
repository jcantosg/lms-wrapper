import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { InternalGroupNotFoundException } from '#shared/domain/exception/internal-group/internal-group.not-found.exception';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { EdaeUserNotFoundException } from '#shared/domain/exception/edae-user/edae-user-not-found.exception';

export class InternalGroupDefaultTeacherGetter {
  constructor(private readonly repository: InternalGroupRepository) {}

  async get(studentId: string, subjectId: string): Promise<EdaeUser> {
    const internalGroup = await this.repository.getByStudentAndSubject(
      studentId,
      subjectId,
    );
    if (!internalGroup) {
      throw new InternalGroupNotFoundException();
    }
    if (!internalGroup.defaultTeacher) {
      throw new EdaeUserNotFoundException();
    }

    return internalGroup.defaultTeacher;
  }
}
