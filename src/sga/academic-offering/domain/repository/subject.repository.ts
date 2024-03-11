import { Subject } from '#academic-offering/domain/entity/subject.entity';

export abstract class SubjectRepository {
  abstract existsByCode(id: string, code: string): Promise<boolean>;

  abstract exists(id: string): Promise<boolean>;

  abstract save(subject: Subject): Promise<void>;
}
