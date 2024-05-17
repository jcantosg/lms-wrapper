import { EnrollmentRepository } from '#student/domain/repository/enrollment.repository';

export class EnrollmentMockRepository implements EnrollmentRepository {
  save = jest.fn();
  get = jest.fn();
  matching = jest.fn();
}
