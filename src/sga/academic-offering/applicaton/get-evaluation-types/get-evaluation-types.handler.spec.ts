import { EvaluationTypeRepository } from '#academic-offering/domain/repository/evaluation-type.repository';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import {
  getABusinessUnit,
  getAnAdminUser,
  getAnEvaluationType,
} from '#test/entity-factory';
import { GetEvaluationTypesQuery } from '#academic-offering/applicaton/get-evaluation-types/get-evaluation-types.query';
import { GetEvaluationTypesHandler } from '#academic-offering/applicaton/get-evaluation-types/get-evaluation-types.handler';
import { getBusinessUnitGetterMock } from '#test/service-factory';
import { BusinessUnitNotFoundException } from '#shared/domain/exception/business-unit/business-unit/business-unit-not-found.exception';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { EvaluationType } from '#academic-offering/domain/entity/evaluation-type.entity';
import { EvaluationTypeMockRepository } from '#test/mocks/sga/academic-offering/evaluation-type.mock-repository';
import clearAllMocks = jest.clearAllMocks;

let repository: EvaluationTypeRepository;
let businessUnitGetter: BusinessUnitGetter;

let getByBusinessUnitSpy: jest.SpyInstance;
let getBusinessUnitSpy: jest.SpyInstance;

const businessUnit = getABusinessUnit();
const adminUser = getAnAdminUser();
const evaluationTypes = [getAnEvaluationType(), getAnEvaluationType()];
const query = new GetEvaluationTypesQuery(businessUnit.id, adminUser);
let handler: GetEvaluationTypesHandler;

describe('Get Evaluation Types Handler', () => {
  beforeAll(() => {
    repository = new EvaluationTypeMockRepository();
    businessUnitGetter = getBusinessUnitGetterMock();
    handler = new GetEvaluationTypesHandler(repository, businessUnitGetter);
    getByBusinessUnitSpy = jest.spyOn(repository, 'getByBusinessUnit');
    getBusinessUnitSpy = jest.spyOn(businessUnitGetter, 'getByAdminUser');
  });

  it('should throw a business unit not found exception', async () => {
    getBusinessUnitSpy.mockImplementation(() => {
      throw new BusinessUnitNotFoundException();
    });
    await expect(handler.handle(query)).rejects.toThrow(
      BusinessUnitNotFoundException,
    );
  });

  it('should return an array of evaluation types', async () => {
    getBusinessUnitSpy.mockImplementation((): Promise<BusinessUnit> => {
      return Promise.resolve(businessUnit);
    });
    getByBusinessUnitSpy.mockImplementation((): Promise<EvaluationType[]> => {
      return Promise.resolve(evaluationTypes);
    });
    const result = await handler.handle(query);
    expect(getByBusinessUnitSpy).toHaveBeenCalledTimes(1);
    expect(result).toEqual(evaluationTypes);
  });

  afterAll(() => {
    clearAllMocks();
  });
});
