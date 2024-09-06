import { LmsEnrollmentRepository } from '#lms-wrapper/domain/repository/lms-enrollment.repository';

export class LmsEnrollmentMockRepository implements LmsEnrollmentRepository {
  delete = jest.fn();
  save = jest.fn();
}
