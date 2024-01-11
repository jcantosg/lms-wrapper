import { VirtualCampusRepository } from '#business-unit/domain/repository/virtual-campus.repository';

export class VirtualCampusMockRepository implements VirtualCampusRepository {
  save = jest.fn();
  existsById = jest.fn();
}
