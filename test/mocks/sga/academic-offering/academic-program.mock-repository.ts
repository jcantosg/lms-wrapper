import { AcademicProgramRepository } from '#academic-offering/domain/repository/academic-program.repository';

export class AcademicProgramMockRepository
  implements AcademicProgramRepository
{
  save = jest.fn();
  get = jest.fn();
  getByAdminUser = jest.fn();
  existsById = jest.fn();
  existsByCode = jest.fn();
  count = jest.fn();
  matching = jest.fn();
  getByAcademicPeriod = jest.fn();
}
