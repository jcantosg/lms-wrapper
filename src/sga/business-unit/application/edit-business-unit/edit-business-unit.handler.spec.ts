import { v4 as uuid } from 'uuid';
import { EditBusinessUnitHandler } from '#business-unit/application/edit-business-unit/edit-business-unit.handler';
import { BusinessUnitRepository } from '#business-unit/domain/repository/business-unit.repository';
import { CountryGetter } from '#shared/domain/service/country-getter.service';
import {
  getBusinessUnitGetterMock,
  getCountryGetterMock,
} from '#test/service-factory';
import { BusinessUnitMockRepository } from '#test/mocks/sga/business-unit/business-unit.mock-repository';
import { Country } from '#shared/domain/entity/country.entity';
import {
  getABusinessUnit,
  getACountry,
  getAnAdminUser,
} from '#test/entity-factory';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { EditBusinessUnitCommand } from '#business-unit/application/edit-business-unit/edit-business-unit.command';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';

let handler: EditBusinessUnitHandler;
let businessUnitRepository: BusinessUnitRepository;
let countryGetter: CountryGetter;
let businessUnitGetter: BusinessUnitGetter;

let getCountrySpy: any;
let updateSpy: any;
let getBusinessUnitSpy: any;

const user = getAnAdminUser();
const command = new EditBusinessUnitCommand(
  uuid(),
  'name',
  'code',
  uuid(),
  user,
  true,
);

const country = getACountry();
const businessUnit = getABusinessUnit(command.id);

user.addBusinessUnit(businessUnit);

describe('Edit Business Unit Handler', () => {
  beforeAll(() => {
    countryGetter = getCountryGetterMock();
    businessUnitRepository = new BusinessUnitMockRepository();
    businessUnitGetter = getBusinessUnitGetterMock();
    getCountrySpy = jest.spyOn(countryGetter, 'get');
    updateSpy = jest.spyOn(businessUnitRepository, 'update');
    getBusinessUnitSpy = jest.spyOn(businessUnitGetter, 'get');
    handler = new EditBusinessUnitHandler(
      businessUnitRepository,
      businessUnitGetter,
      countryGetter,
    );
  });
  it('Should edit a business unit', async () => {
    getCountrySpy.mockImplementation((): Promise<Country | null> => {
      return Promise.resolve(country);
    });

    getBusinessUnitSpy.mockImplementation((): Promise<BusinessUnit | null> => {
      return Promise.resolve(businessUnit);
    });
    await handler.handle(command);
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        _code: 'code',
        _name: 'name',
      }),
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
