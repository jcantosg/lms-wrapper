import { StudentRepository } from '#/student-360/student/domain/repository/student.repository';

export class StudentMockRepository implements StudentRepository {
  save = jest.fn();
  existsById = jest.fn();
  existsByEmail = jest.fn();
  existsByUniversaeEmail = jest.fn();
  get = jest.fn();
  count = jest.fn();
  matching = jest.fn();
  getByEmail = jest.fn();
}
