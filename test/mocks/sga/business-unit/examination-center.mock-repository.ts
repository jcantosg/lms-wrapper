import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';

export class ExaminationCenterMockRepository
  implements ExaminationCenterRepository
{
  save = jest.fn();
  existsById = jest.fn();
  existsByName = jest.fn();
  existsByCode = jest.fn();
}
