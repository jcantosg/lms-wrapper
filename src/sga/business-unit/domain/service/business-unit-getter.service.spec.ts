import { BusinessUnitRepository } from '#business-unit/domain/repository/business-unit.repository';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { BusinessUnitMockRepository } from '#test/mocks/sga/business-unit/business-unit.mock-repository';
import { getABusinessUnit } from '#test/entity-factory';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { BusinessUnitNotFoundException } from '#shared/domain/exception/business-unit/business-unit-not-found.exception';

let businessUnitRepository: BusinessUnitRepository;
let service: BusinessUnitGetter;
let getByIdSpy: any;
const businessUnit = getABusinessUnit('ab40d44d-c2ae-4275-a00c-86be023029f7');

describe('Business Unit Getter Service', () => {
  beforeAll(() => {
    businessUnitRepository = new BusinessUnitMockRepository();
    service = new BusinessUnitGetter(businessUnitRepository);
    getByIdSpy = jest.spyOn(businessUnitRepository, 'get');
  });
  it('should get a business unit', async () => {
    getByIdSpy.mockImplementation((): Promise<BusinessUnit | null> => {
      return Promise.resolve(businessUnit);
    });
    const getBusinessUnit = await service.get(
      'ab40d44d-c2ae-4275-a00c-86be023029f7',
    );
    expect(getByIdSpy).toHaveBeenCalledTimes(1);
    expect(getBusinessUnit).toEqual(businessUnit);
  });
  it('should throw a business unit not found exception', () => {
    getByIdSpy.mockImplementation((): Promise<BusinessUnit | null> => {
      return Promise.resolve(null);
    });
    expect(service.get('ab40d44d-c2ae-4275-a00c-86be023029f7')).rejects.toThrow(
      BusinessUnitNotFoundException,
    );
  });
});
