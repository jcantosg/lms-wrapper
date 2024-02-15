import {
  getABusinessUnit,
  getACountry,
  getAnAdminUser,
  getAnExaminationCenter,
} from '#test/entity-factory';
import { ExaminationCenterMockRepository } from '#test/mocks/sga/business-unit/examination-center.mock-repository';
import {
  getAnExaminationCenterGetterMock,
  getCountryGetterMock,
} from '#test/service-factory';
import { v4 as uuid } from 'uuid';
import { EditExaminationCenterHandler } from './edit-examination-center.handler';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';
import { ExaminationCenterGetter } from '#business-unit/domain/service/examination-center-getter.service';
import { EditExaminationCenterCommand } from './edit-examination-center.command';
import { ExaminationCenterDuplicatedNameException } from '#shared/domain/exception/business-unit/examination-center/examination-center-duplicated-name.exception';
import { ExaminationCenterDuplicatedCodeException } from '#shared/domain/exception/business-unit/examination-center/examination-center-duplicated-code.exception';
import { CountryGetter } from '#shared/domain/service/country-getter.service';
import { Country } from '#shared/domain/entity/country.entity';

let handler: EditExaminationCenterHandler;
let examinationCenterRepository: ExaminationCenterRepository;
let examinationCenterGetter: ExaminationCenterGetter;
let countryGetter;
CountryGetter;

let updateSpy: any;
let getExaminationCenterSpy: any;
let existsByCodeSpy: any;
let existsByNameSpy: any;
let countrySpy: any;

const businessUnit = getABusinessUnit();

const user = getAnAdminUser();
const command = new EditExaminationCenterCommand(
  uuid(),
  'name',
  'code',
  'address',
  user,
  true,
  uuid(),
);

const examinationCenter = getAnExaminationCenter(command.id);

user.addBusinessUnit(businessUnit);

describe('Edit Examination Center Handler', () => {
  beforeAll(() => {
    examinationCenterRepository = new ExaminationCenterMockRepository();
    examinationCenterGetter = getAnExaminationCenterGetterMock();
    countryGetter = getCountryGetterMock();

    getExaminationCenterSpy = jest.spyOn(examinationCenterGetter, 'get');
    updateSpy = jest.spyOn(examinationCenterRepository, 'update');
    existsByCodeSpy = jest.spyOn(examinationCenterRepository, 'existsByCode');
    existsByNameSpy = jest.spyOn(examinationCenterRepository, 'existsByName');
    countrySpy = jest.spyOn(countryGetter, 'get');

    handler = new EditExaminationCenterHandler(
      examinationCenterRepository,
      examinationCenterGetter,
      countryGetter,
    );
  });

  it('should edit an examination center', async () => {
    getExaminationCenterSpy.mockImplementation(
      (): Promise<ExaminationCenter | null> => {
        return Promise.resolve(examinationCenter);
      },
    );

    countrySpy.mockImplementation((): Promise<Country> => {
      return Promise.resolve(getACountry());
    });

    await handler.handle(command);

    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        _code: 'code',
        _name: 'name',
        _address: 'address',
      }),
    );
  });

  it('should throw a duplicated name error', async () => {
    existsByNameSpy.mockImplementation((): Promise<boolean> => {
      return Promise.resolve(true);
    });
    countrySpy.mockImplementation((): Promise<Country> => {
      return Promise.resolve(getACountry());
    });

    await expect(handler.handle(command)).rejects.toThrow(
      ExaminationCenterDuplicatedNameException,
    );
  });

  it('should throw a duplicated code error', async () => {
    existsByNameSpy.mockImplementation((): Promise<boolean> => {
      return Promise.resolve(false);
    });
    existsByCodeSpy.mockImplementation((): Promise<boolean> => {
      return Promise.resolve(true);
    });
    countrySpy.mockImplementation((): Promise<Country> => {
      return Promise.resolve(getACountry());
    });

    await expect(handler.handle(command)).rejects.toThrow(
      ExaminationCenterDuplicatedCodeException,
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
