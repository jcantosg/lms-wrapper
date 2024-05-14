import { Enrollment } from '#student/domain/entity/enrollment.entity';

export abstract class EnrollmentRepository {
  abstract save(enrollment: Enrollment): Promise<void>;
}
