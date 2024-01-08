import { BusinessUnitRepository } from '#business-unit/domain/repository/business-unit.repository';

export class BusinessUnitMockRepository implements BusinessUnitRepository {
  save = jest.fn();
  get = jest.fn();
  existsById = jest.fn();
  existsByName = jest.fn();
  existsByCode = jest.fn();
  matching = jest.fn();
  count = jest.fn();
  update = jest.fn();
}
