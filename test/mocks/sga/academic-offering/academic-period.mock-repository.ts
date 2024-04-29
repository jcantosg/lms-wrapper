import { AcademicPeriodRepository } from '#/sga/academic-offering/domain/repository/academic-period.repository';

export class AcademicPeriodMockRepository implements AcademicPeriodRepository {
  save = jest.fn();

  existsByCode = jest.fn();

  existsById = jest.fn();

  matching = jest.fn();

  count = jest.fn();

  get = jest.fn();

  getByAdminUser = jest.fn();

  update = jest.fn();

  getByBusinessUnit = jest.fn();
}
