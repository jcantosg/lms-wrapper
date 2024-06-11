import { LmsStudentRepository } from '#/lms-wrapper/domain/repository/lms-student.repository';

export class LmsStudentMockRepository implements LmsStudentRepository {
  save = jest.fn();
  delete = jest.fn();
}
