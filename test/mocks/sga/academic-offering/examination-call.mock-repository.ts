import { ExaminationCallRepository } from '#/sga/academic-offering/domain/repository/examination-call.repository';

export class ExaminationCallMockRepository
  implements ExaminationCallRepository
{
  existsById = jest.fn();
  save = jest.fn();
  get = jest.fn();
  getByAdminUser = jest.fn();

  delete = jest.fn();
}
