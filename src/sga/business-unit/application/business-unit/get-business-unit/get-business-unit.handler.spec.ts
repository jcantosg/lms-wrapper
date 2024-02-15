import { v4 as uuid } from 'uuid';
import { GetBusinessUnitHandler } from '#business-unit/application/business-unit/get-business-unit/get-business-unit.handler';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { getBusinessUnitGetterMock } from '#test/service-factory';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { getABusinessUnit } from '#test/entity-factory';
import { GetBusinessUnitQuery } from '#business-unit/application/business-unit/get-business-unit/get-business-unit.query';
import { BusinessUnitNotFoundException } from '#shared/domain/exception/business-unit/business-unit/business-unit-not-found.exception';

let handler: GetBusinessUnitHandler;
let businessUnitGetter: BusinessUnitGetter;
let getBusinessUnitSpy: any;
const query = new GetBusinessUnitQuery(uuid(), [uuid()]);
const businessUnit = getABusinessUnit(query.id);

describe('Get Business Unit Handler', () => {
  beforeAll(() => {
    businessUnitGetter = getBusinessUnitGetterMock();
    getBusinessUnitSpy = jest.spyOn(businessUnitGetter, 'getByAdminUser');
    handler = new GetBusinessUnitHandler(businessUnitGetter);
  });
  it('should return a business unit', async () => {
    getBusinessUnitSpy.mockImplementation((): Promise<BusinessUnit | null> => {
      return Promise.resolve(businessUnit);
    });
    const businessUnitResult = await handler.handle(query);
    expect(businessUnitResult).toEqual(businessUnit);
  });
  it('should throw a Business Not Found', () => {
    getBusinessUnitSpy.mockImplementation(() => {
      throw new BusinessUnitNotFoundException();
    });
    expect(handler.handle(query)).rejects.toThrow(
      BusinessUnitNotFoundException,
    );
  });
});
