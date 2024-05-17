import { EnrollmentRepository } from '#student/domain/repository/enrollment.repository';
import { Enrollment } from '#student/domain/entity/enrollment.entity';
import { EnrollmentNotFoundException } from '#student/shared/exception/enrollment-not-found.exception';

export class EnrollmentGetter {
  constructor(private readonly repository: EnrollmentRepository) {}

  public async get(id: string): Promise<Enrollment> {
    const enrollment = await this.repository.get(id);
    if (!enrollment) {
      throw new EnrollmentNotFoundException();
    }

    return enrollment;
  }
}
