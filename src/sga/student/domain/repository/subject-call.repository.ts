import { SubjectCall } from '#student/domain/entity/subject-call.entity';

export abstract class SubjectCallRepository {
  abstract save(subjectCall: SubjectCall): Promise<void>;
}
