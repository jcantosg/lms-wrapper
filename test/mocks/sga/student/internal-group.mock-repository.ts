import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';

export class InternalGroupMockRepository implements InternalGroupRepository {
  save = jest.fn();
  saveBatch = jest.fn();
  get = jest.fn();
  getByKeys = jest.fn();
}
