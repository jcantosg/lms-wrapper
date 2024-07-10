import { LmsEnrollmentRepository } from '#lms-wrapper/domain/repository/lms-enrollment.repository';
import { LmsEnrollment } from '#lms-wrapper/domain/entity/lms-enrollment';
import { MoodleWrapper } from '#lms-wrapper/infrastructure/wrapper/moodle-wrapper';

export class MoodleEnrollmentRepository implements LmsEnrollmentRepository {
  constructor(private readonly moodleWrapper: MoodleWrapper) {}

  async delete(courseId: number, studentId: number): Promise<void> {
    await this.moodleWrapper.deleteEnrollment(courseId, studentId);
  }

  async save(enrollment: LmsEnrollment): Promise<void> {
    await this.moodleWrapper.createEnrollment(
      enrollment.value.courseId,
      enrollment.value.studentId,
      enrollment.value.startDate,
      enrollment.value.endDate,
    );
  }
}
