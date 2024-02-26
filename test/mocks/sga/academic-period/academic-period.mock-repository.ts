import { AcademicPeriodRepository } from '#/sga/academic-offering/domain/repository/academic-period.repository';

export class AcademicPeriodMockRepository implements AcademicPeriodRepository {
  save = jest.fn();

  existsByCode = jest.fn();

  existsById = jest.fn();
}
