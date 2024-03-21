import { SubjectResource } from '#academic-offering/domain/entity/subject-resource.entity';
import { SubjectResourceRepository } from '#academic-offering/domain/repository/subject-resource.repository';
import { SubjectResourceNotFoundException } from '#shared/domain/exception/academic-offering/subject-resource.not-found.exception';

export class SubjectResourceGetter {
  constructor(
    private readonly subjectResourceRepository: SubjectResourceRepository,
  ) {}

  async get(id: string): Promise<SubjectResource> {
    const subjectResource = await this.subjectResourceRepository.get(id);

    if (!subjectResource) {
      throw new SubjectResourceNotFoundException();
    }

    return subjectResource;
  }
}
