import { EnrollmentRepository } from '#student/domain/repository/enrollment.repository';

export class EnrollmentMockRepository implements EnrollmentRepository {
  save = jest.fn();
  get = jest.fn();
  matching = jest.fn();
  delete = jest.fn();
  getByAcademicRecord = jest.fn();
  getByAdminUser = jest.fn();
  getBySubject = jest.fn();
  getByStudentAndSubject = jest.fn();
  getByMultipleSubjects = jest.fn();
  getByStudentsAndSubjects = jest.fn();
  exists = jest.fn();
}
