import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { CreateBusinessUnitCommand } from '#business-unit/application/create-business-unit/create-business-unit.command';
import { CreateBusinessUnitHandler } from '#business-unit/application/create-business-unit/create-business-unit.handler';
import { BusinessUnitRepository } from '#business-unit/domain/repository/business-unit.repository';
import { Country } from '#shared/domain/entity/country.entity';
import { BusinessUnitDuplicatedException } from '#shared/domain/exception/business-unit/business-unit-duplicated.exception';
import { CountryGetter } from '#shared/domain/service/country-getter.service';
import { getACountry, getAnAdminUser } from '#test/entity-factory';
import { BusinessUnitMockRepository } from '#test/mocks/sga/business-unit/business-unit.mock-repository';
import {
  getAdminUserGetterMock,
  getCountryGetterMock,
} from '#test/service-factory';
import { v4 as uuid } from 'uuid';
import { VirtualCampusRepository } from '#business-unit/domain/repository/virtual-campus.repository';
import { VirtualCampusMockRepository } from '#test/mocks/sga/business-unit/virtual-campus.mock-repository';
import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';
import { ExaminationCenterMockRepository } from '#test/mocks/sga/business-unit/examination-center.mock-repository';
import { EventDispatcher } from '#shared/domain/event/event-dispatcher.service';
import { EventDispatcherMock } from '#test/mocks/shared/event-dispatcher.mock-service';

let handler: CreateBusinessUnitHandler;
let businessUnitRepository: BusinessUnitRepository;
let adminUserGetter: AdminUserGetter;
let countryGetter: CountryGetter;
let virtualCampusRepository: VirtualCampusRepository;
let examinationCenterRepository: ExaminationCenterRepository;
let eventDispatcher: EventDispatcher;

let getUserSpy: any;
let getCountrySpy: any;
let existsBusinessUnitByIdSpy: any;
let saveSpy: any;
let saveVirtualCampusSpy: any;
let saveExaminationCenterSpy: any;
let getNextAvailableCodeSpy: any;
let dispatchSpy: any;

const command = new CreateBusinessUnitCommand(
  uuid(),
  'name',
  'code',
  uuid(),
  uuid(),
);

const user = getAnAdminUser();
const country = getACountry();
const examinationCenterCode = 'NAM01';

describe('Create Business Unit Handler', () => {
  beforeAll(() => {
    businessUnitRepository = new BusinessUnitMockRepository();
    adminUserGetter = getAdminUserGetterMock();
    countryGetter = getCountryGetterMock();
    virtualCampusRepository = new VirtualCampusMockRepository();
    examinationCenterRepository = new ExaminationCenterMockRepository();
    eventDispatcher = new EventDispatcherMock();

    getUserSpy = jest.spyOn(adminUserGetter, 'get');
    getCountrySpy = jest.spyOn(countryGetter, 'get');
    existsBusinessUnitByIdSpy = jest.spyOn(
      businessUnitRepository,
      'existsById',
    );
    saveSpy = jest.spyOn(businessUnitRepository, 'save');
    saveVirtualCampusSpy = jest.spyOn(virtualCampusRepository, 'save');
    saveExaminationCenterSpy = jest.spyOn(examinationCenterRepository, 'save');
    getNextAvailableCodeSpy = jest.spyOn(
      examinationCenterRepository,
      'getNextAvailableCode',
    );
    dispatchSpy = jest.spyOn(eventDispatcher, 'dispatch');

    handler = new CreateBusinessUnitHandler(
      businessUnitRepository,
      adminUserGetter,
      countryGetter,
      virtualCampusRepository,
      examinationCenterRepository,
      eventDispatcher,
    );
  });

  it('Should create a business unit', async () => {
    existsBusinessUnitByIdSpy.mockImplementation((): Promise<boolean> => {
      return Promise.resolve(false);
    });

    getUserSpy.mockImplementation((): Promise<AdminUser | null> => {
      return Promise.resolve(user);
    });

    getCountrySpy.mockImplementation((): Promise<Country | null> => {
      return Promise.resolve(country);
    });

    getNextAvailableCodeSpy.mockImplementation((): Promise<string> => {
      return Promise.resolve('NAM01');
    });

    await handler.handle(command);

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: command.id,
        _name: command.name,
        _code: command.code,
        _createdBy: user,
        _updatedBy: user,
        _isActive: true,
      }),
    );
    expect(saveVirtualCampusSpy).toHaveBeenCalledTimes(1);
    expect(saveVirtualCampusSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        _name: command.name,
      }),
    );
    expect(saveExaminationCenterSpy).toHaveBeenCalledTimes(1);
    expect(saveExaminationCenterSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        _name: command.name,
        _code: examinationCenterCode,
      }),
    );
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'business-unit.created',
      }),
    );
  });

  it('Should throw a BusinessUnitDuplicatedException', async () => {
    existsBusinessUnitByIdSpy.mockImplementation((): Promise<boolean> => {
      return Promise.resolve(true);
    });

    await expect(handler.handle(command)).rejects.toThrow(
      BusinessUnitDuplicatedException,
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
