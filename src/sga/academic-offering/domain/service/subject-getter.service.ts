import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { SubjectNotFoundException } from '#shared/domain/exception/academic-offering/subject-not-found.exception';

export class SubjectGetter {
  constructor(private readonly repository: SubjectRepository) {}

  async get(id: string): Promise<Subject> {
    const subject = await this.repository.get(id);
    if (!subject) {
      throw new SubjectNotFoundException();
    }

    return subject;
  }
}
