import { SubjectCall } from '#student/domain/entity/subject-call.entity';

export abstract class SubjectCallRepository {
  abstract save(subjectCall: SubjectCall): Promise<void>;

  abstract delete(subjectCall: SubjectCall): Promise<void>;

  abstract existsById(id: string): Promise<boolean>;

  abstract get(id: string): Promise<SubjectCall | null>;

  abstract getByAdminUser(
    id: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<SubjectCall | null>;
}
