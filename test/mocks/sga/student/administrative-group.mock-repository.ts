import { AdministrativeGroupRepository } from '#student/domain/repository/administrative-group.repository';

export class AdministrativeGroupMockRepository
  implements AdministrativeGroupRepository
{
  save = jest.fn();
  saveBatch = jest.fn();
  existsById = jest.fn();
  existsByCode = jest.fn();
}
