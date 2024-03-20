import { SubjectResource } from '#academic-offering/domain/entity/subject-resource.entity';

export abstract class SubjectResourceRepository {
  abstract save(subjectResource: SubjectResource): Promise<void>;

  abstract existsById(id: string): Promise<boolean>;
}
