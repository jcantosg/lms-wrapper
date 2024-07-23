import { AdministrativeProcessRepository } from '#student/domain/repository/administrative-process.repository';

export class AdministrativeProcessMockRepository
  implements AdministrativeProcessRepository
{
  save = jest.fn();
  get = jest.fn();
}
