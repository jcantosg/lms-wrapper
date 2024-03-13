import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';

export class SubjectMockRepository implements SubjectRepository {
  get = jest.fn();
  save = jest.fn();
  existsByCode = jest.fn();
  exists = jest.fn();
  getByAdminUser = jest.fn();
  matching = jest.fn();
  count = jest.fn();
}
