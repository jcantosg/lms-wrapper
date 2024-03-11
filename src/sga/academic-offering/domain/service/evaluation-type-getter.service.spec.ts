import { EvaluationTypeGetter } from '#academic-offering/domain/service/evaluation-type-getter.service';
import { EvaluationTypeRepository } from '#academic-offering/domain/repository/evaluation-type.repository';
import { getAnEvaluationType } from '#test/entity-factory';
import { EvaluationTypeMockRepository } from '#test/mocks/sga/academic-offering/evaluation-type.mock-repository';
import { EvaluationType } from '#academic-offering/domain/entity/evaluation-type.entity';
import { EvaluationTypeNotFoundException } from '#shared/domain/exception/academic-offering/evaluation-type.not-found.exception';
import clearAllMocks = jest.clearAllMocks;

let service: EvaluationTypeGetter;
let repository: EvaluationTypeRepository;

const evaluationType = getAnEvaluationType();

let getSpy: jest.SpyInstance;

describe('Evaluation Type Getter Service', () => {
  beforeAll(() => {
    repository = new EvaluationTypeMockRepository();
    service = new EvaluationTypeGetter(repository);
    getSpy = jest.spyOn(repository, 'get');
  });

  it('should return an evaluation type', async () => {
    getSpy.mockImplementation((): Promise<EvaluationType> => {
      return Promise.resolve(evaluationType);
    });
    const result = await service.get(evaluationType.id);
    expect(getSpy).toHaveBeenCalledTimes(1);
    expect(result).toEqual(evaluationType);
  });

  it('should throw an EvaluationTypeNotFoundException', async () => {
    getSpy.mockImplementation((): Promise<EvaluationType | null> => {
      return Promise.resolve(null);
    });
    await expect(service.get(evaluationType.id)).rejects.toThrow(
      EvaluationTypeNotFoundException,
    );
  });

  afterAll(() => {
    clearAllMocks();
  });
});
