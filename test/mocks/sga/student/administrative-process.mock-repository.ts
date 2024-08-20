import { AdministrativeProcessRepository } from '#student/domain/repository/administrative-process.repository';

export class AdministrativeProcessMockRepository
  implements AdministrativeProcessRepository
{
  save = jest.fn();
  get = jest.fn();
  count = jest.fn();
  matching = jest.fn();
  getByStudent = jest.fn();
  getByAcademicRecord = jest.fn();
}
