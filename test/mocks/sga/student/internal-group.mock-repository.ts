import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';

export class InternalGroupMockRepository implements InternalGroupRepository {
  save = jest.fn();
  saveBatch = jest.fn();
  get = jest.fn();
  getByKeys = jest.fn();
  count = jest.fn();
  matching = jest.fn();
  getByAdminUser = jest.fn();
  getByStudentAndSubject = jest.fn();
  getAllByStudentAndKeys = jest.fn();
  getAllByStudent = jest.fn();
  getAllByTeacher = jest.fn();
}
