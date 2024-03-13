import { Subject } from '#academic-offering/domain/entity/subject.entity';

export abstract class SubjectRepository {
  abstract existsByCode(id: string, code: string): Promise<boolean>;

  abstract exists(id: string): Promise<boolean>;

  abstract save(subject: Subject): Promise<void>;

  abstract get(id: string): Promise<Subject | null>;

  abstract getByAdminUser(
    id: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<Subject | null>;

  abstract matching(
    criteria: any,
    adminUserBusinessUnits: any[],
    isSuperAdmin: boolean,
  ): Promise<Subject[]>;

  abstract count(
    criteria: any,
    adminUserBusinessUnits: any[],
    isSuperAdmin: boolean,
  ): Promise<number>;
}
