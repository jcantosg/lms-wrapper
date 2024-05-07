import { PeriodBlockRepository } from '#academic-offering/domain/repository/period-block.repository';

export class PeriodBlockMockRepository implements PeriodBlockRepository {
  existsById = jest.fn();
  save = jest.fn();
  get = jest.fn();
  getByAdminUser = jest.fn();
  delete = jest.fn();
  getByAcademicPeriod = jest.fn();
}
