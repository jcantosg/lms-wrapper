import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { getABusinessUnit } from '#test/entity-factory';
import { GetAllBusinessUnitsPlainHandler } from '#business-unit/application/get-all-business-units-plain/get-all-business-units-plain.handler';
import { BusinessUnitRepository } from '#business-unit/domain/repository/business-unit.repository';
import { BusinessUnitMockRepository } from '#test/mocks/sga/business-unit/business-unit.mock-repository';

let handler: GetAllBusinessUnitsPlainHandler;
let businessUnitRepository: BusinessUnitRepository;
let getAllBusinessUnitSpy: any;
const businessUnits = [getABusinessUnit(), getABusinessUnit()];

describe('Get All Business Units Handler', () => {
  beforeAll(() => {
    businessUnitRepository = new BusinessUnitMockRepository();
    getAllBusinessUnitSpy = jest.spyOn(businessUnitRepository, 'getAll');
    handler = new GetAllBusinessUnitsPlainHandler(businessUnitRepository);
  });
  it('should return two business units', async () => {
    getAllBusinessUnitSpy.mockImplementation((): Promise<BusinessUnit[]> => {
      return Promise.resolve(businessUnits);
    });
    const businessUnitsResult = await handler.handle();
    expect(businessUnitsResult.length).toEqual(2);
    expect(businessUnitsResult).toEqual(businessUnits);
  });
});
