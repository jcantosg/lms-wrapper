import { CreateAcademicPeriodHandler } from '#academic-offering/applicaton/create-academic-period/create-academic-period.handler';
import { AcademicPeriodRepository } from '#academic-offering/domain/repository/academic-period.repository';
import { ExaminationCallRepository } from '#academic-offering/domain/repository/examination-call.repository';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { getABusinessUnit, getAnAdminUser } from '#test/entity-factory';
import { CreateAcademicPeriodCommand } from '#academic-offering/applicaton/create-academic-period/create-academic-period.command';
import { v4 as uuid } from 'uuid';
import { TimeZoneEnum } from '#shared/domain/enum/time-zone.enum';
import { AcademicPeriodMockRepository } from '#test/mocks/sga/academic-period/academic-period.mock-repository';
import { ExaminationCallMockRepository } from '#test/mocks/sga/academic-period/examination-call.mock-repository';
import { getBusinessUnitGetterMock } from '#test/service-factory';
import { AcademicPeriodDuplicatedCodeException } from '#shared/domain/exception/academic-period/academic-period.duplicated-code.exception';
import { AcademicPeriodNotExaminationCallsException } from '#shared/domain/exception/academic-period/academic-period.not-examination-calls.exception';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AcademicPeriodWrongBlockNumberException } from '#shared/domain/exception/academic-period/academic-period.wrong-block-number.exception';

let handler: CreateAcademicPeriodHandler;
let repository: AcademicPeriodRepository;
let examinationCallRepository: ExaminationCallRepository;
let businessUnitGetter: BusinessUnitGetter;
const businessUnit = getABusinessUnit();
const command = new CreateAcademicPeriodCommand(
  uuid(),
  'name',
  'code',
  new Date(),
  new Date(),
  businessUnit.id,
  [
    {
      id: uuid(),
      name: 'name',
      startDate: new Date(),
      endDate: new Date(),
      timezone: TimeZoneEnum.GMT_PLUS_1,
    },
  ],
  1,
  [businessUnit.id],
  getAnAdminUser(),
);

const wrongCommand = new CreateAcademicPeriodCommand(
  uuid(),
  'name',
  'code',
  new Date(),
  new Date(),
  businessUnit.id,
  [],
  1,
  [businessUnit.id],
  getAnAdminUser(),
);
const wrongCommandBlockNumber = new CreateAcademicPeriodCommand(
  uuid(),
  'name',
  'code',
  new Date(),
  new Date(),
  businessUnit.id,
  [
    {
      id: uuid(),
      name: 'name',
      startDate: new Date(),
      endDate: new Date(),
      timezone: TimeZoneEnum.GMT_PLUS_1,
    },
  ],
  0,
  [businessUnit.id],
  getAnAdminUser(),
);

let existsByCodeSpy: any;
let saveAcademicPeriodSpy: any;
let saveExaminationCallSpy: any;
let getBusinessUnitSpy: any;

describe('Create Academic Period Handler test', () => {
  beforeAll(() => {
    repository = new AcademicPeriodMockRepository();
    examinationCallRepository = new ExaminationCallMockRepository();
    businessUnitGetter = getBusinessUnitGetterMock();
    handler = new CreateAcademicPeriodHandler(
      repository,
      examinationCallRepository,
      businessUnitGetter,
    );
    existsByCodeSpy = jest.spyOn(repository, 'existsByCode');
    getBusinessUnitSpy = jest.spyOn(businessUnitGetter, 'getByAdminUser');
    saveAcademicPeriodSpy = jest.spyOn(repository, 'save');
    saveExaminationCallSpy = jest.spyOn(examinationCallRepository, 'save');
  });
  it('should throw a duplicated code exception', async () => {
    existsByCodeSpy.mockImplementation((): Promise<boolean> => {
      return Promise.resolve(true);
    });
    await expect(async () => {
      await handler.handle(command);
    }).rejects.toThrow(AcademicPeriodDuplicatedCodeException);
  });
  it('should throw a examination calls empty exception', async () => {
    existsByCodeSpy.mockImplementation((): Promise<boolean> => {
      return Promise.resolve(false);
    });
    getBusinessUnitSpy.mockImplementation((): Promise<BusinessUnit> => {
      return Promise.resolve(businessUnit);
    });
    await expect(async () => {
      await handler.handle(wrongCommand);
    }).rejects.toThrow(AcademicPeriodNotExaminationCallsException);
  });
  it('should throw a wrong block number exception', async () => {
    getBusinessUnitSpy.mockImplementation((): Promise<BusinessUnit> => {
      return Promise.resolve(businessUnit);
    });
    await expect(async () => {
      await handler.handle(wrongCommandBlockNumber);
    }).rejects.toThrow(AcademicPeriodWrongBlockNumberException);
  });

  it('should create an academic period', async () => {
    getBusinessUnitSpy.mockImplementation((): Promise<BusinessUnit> => {
      return Promise.resolve(businessUnit);
    });
    await handler.handle(command);
    expect(saveAcademicPeriodSpy).toHaveBeenCalledTimes(1);
    expect(saveExaminationCallSpy).toHaveBeenCalledTimes(1);
    expect(saveAcademicPeriodSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: command.id,
        _name: command.name,
        _code: command.code,
        _businessUnit: businessUnit,
      }),
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
