import { VirtualCampusRepository } from '#business-unit/domain/repository/virtual-campus.repository';

export class VirtualCampusMockRepository implements VirtualCampusRepository {
  save = jest.fn();
  existsById = jest.fn();
  get = jest.fn();
  update = jest.fn();
  existsByCode = jest.fn();
  existsByName = jest.fn();
}
