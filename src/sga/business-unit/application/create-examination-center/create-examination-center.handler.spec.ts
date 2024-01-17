import { CreateExaminationCenterHandler } from '#business-unit/application/create-examination-center/create-examination-center.handler';
import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { getACountry, getAnAdminUser } from '#test/entity-factory';
import {
  getAdminUserGetterMock,
  getBusinessUnitGetterMock,
  getCountryGetterMock,
} from '#test/service-factory';
import { ExaminationCenterMockRepository } from '#test/mocks/sga/business-unit/examination-center.mock-repository';
import { CreateExaminationCenterCommand } from '#business-unit/application/create-examination-center/create-examination-center.command';
import { v4 as uuid } from 'uuid';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { ExaminationCenterDuplicatedNameException } from '#shared/domain/exception/business-unit/examination-center-duplicated-name.exception';
import { ExaminationCenterDuplicatedCodeException } from '#shared/domain/exception/business-unit/examination-center-duplicated-code.exception';
import { CountryGetter } from '#shared/domain/service/country-getter.service';
import { Country } from '#shared/domain/entity/country.entity';

let handler: CreateExaminationCenterHandler;
let examinationCenterRepository: ExaminationCenterRepository;
let adminUserGetter: AdminUserGetter;
let businessUnitGetter: BusinessUnitGetter;
let countryGetter: CountryGetter;
let existsByNameSpy: any;
let existsByCodeSpy: any;
let saveExaminationCenterSpy: any;
let getAdminUserSpy: any;
let getCountrySpy: any;

const user = getAnAdminUser();
const command = new CreateExaminationCenterCommand(
  uuid(),
  'name',
  'code',
  [],
  'address',
  user.id,
  'countryId',
);
const country = getACountry();

describe('Create Examination Center Handler', () => {
  beforeAll(() => {
    adminUserGetter = getAdminUserGetterMock();
    businessUnitGetter = getBusinessUnitGetterMock();
    countryGetter = getCountryGetterMock();
    examinationCenterRepository = new ExaminationCenterMockRepository();
    existsByNameSpy = jest.spyOn(examinationCenterRepository, 'existsByName');
    existsByCodeSpy = jest.spyOn(examinationCenterRepository, 'existsByCode');
    saveExaminationCenterSpy = jest.spyOn(examinationCenterRepository, 'save');
    getCountrySpy = jest.spyOn(countryGetter, 'get');
    getAdminUserSpy = jest.spyOn(adminUserGetter, 'get');

    handler = new CreateExaminationCenterHandler(
      examinationCenterRepository,
      businessUnitGetter,
      adminUserGetter,
      countryGetter,
    );
  });
  it('should create an examination center', async () => {
    existsByNameSpy.mockImplementation((): Promise<boolean> => {
      return Promise.resolve(false);
    });
    existsByCodeSpy.mockImplementation((): Promise<boolean> => {
      return Promise.resolve(false);
    });
    getAdminUserSpy.mockImplementation((): Promise<AdminUser | null> => {
      return Promise.resolve(user);
    });
    getCountrySpy.mockImplementation((): Promise<Country | null> => {
      return Promise.resolve(country);
    });
    await handler.handle(command);
    expect(saveExaminationCenterSpy).toHaveBeenCalledTimes(1);
    expect(saveExaminationCenterSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: command.id,
        _name: command.name,
        _code: command.code,
        _businessUnits: command.businessUnits,
        _address: command.address,
        _createdBy: user,
        _updatedBy: user,
      }),
    );
  });
  it('should return an ExaminationCenterDuplicatedNameException', async () => {
    existsByNameSpy.mockImplementation((): Promise<boolean> => {
      return Promise.resolve(true);
    });
    await expect(handler.handle(command)).rejects.toThrow(
      ExaminationCenterDuplicatedNameException,
    );
  });
  it('should return an ExaminationCenterDuplicatedCodeException', async () => {
    existsByNameSpy.mockImplementation((): Promise<boolean> => {
      return Promise.resolve(false);
    });
    existsByCodeSpy.mockImplementation((): Promise<boolean> => {
      return Promise.resolve(true);
    });
    await expect(handler.handle(command)).rejects.toThrow(
      ExaminationCenterDuplicatedCodeException,
    );
  });
});
