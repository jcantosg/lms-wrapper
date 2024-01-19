import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';

export class ExaminationCenterMockRepository
  implements ExaminationCenterRepository
{
  save = jest.fn();
  existsById = jest.fn();
  existsByName = jest.fn();
  existsByCode = jest.fn();
  count = jest.fn();
  matching = jest.fn();
  get = jest.fn();
  delete = jest.fn();
  update = jest.fn();
  getNextAvailableCode = jest.fn();
  getByBusinessUnit = jest.fn();
}
