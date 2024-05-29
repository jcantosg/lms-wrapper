import { Enrollment } from '#student/domain/entity/enrollment.entity';
import { Criteria } from '#/sga/shared/domain/criteria/criteria';

export abstract class EnrollmentRepository {
  abstract save(enrollment: Enrollment): Promise<void>;

  abstract get(id: string): Promise<Enrollment | null>;

  abstract matching(criteria: Criteria): Promise<Enrollment[]>;

  abstract delete(enrollment: Enrollment): Promise<void>;
}
