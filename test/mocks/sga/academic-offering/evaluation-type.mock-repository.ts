import { EvaluationTypeRepository } from '#academic-offering/domain/repository/evaluation-type.repository';

export class EvaluationTypeMockRepository implements EvaluationTypeRepository {
  exists = jest.fn();
  get = jest.fn();
  save = jest.fn();
  getByBusinessUnit = jest.fn();
}
