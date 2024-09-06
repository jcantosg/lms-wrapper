import { LmsEnrollment } from '#lms-wrapper/domain/entity/lms-enrollment';

export abstract class LmsEnrollmentRepository {
  abstract save(enrollment: LmsEnrollment): Promise<void>;

  abstract delete(courseId: number, studentId: number): Promise<void>;
}
