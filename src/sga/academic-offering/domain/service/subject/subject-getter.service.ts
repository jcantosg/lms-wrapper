import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { SubjectNotFoundException } from '#shared/domain/exception/academic-offering/subject.not-found.exception';

export class SubjectGetter {
  constructor(private readonly subjectRepository: SubjectRepository) {}

  async get(id: string): Promise<Subject> {
    const subject = await this.subjectRepository.get(id);

    if (!subject) {
      throw new SubjectNotFoundException();
    }

    return subject;
  }

  async getByAdminUser(
    id: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<Subject> {
    const result = await this.subjectRepository.getByAdminUser(
      id,
      adminUserBusinessUnits,
      isSuperAdmin,
    );

    if (!result) {
      throw new SubjectNotFoundException();
    }

    return result;
  }
}
