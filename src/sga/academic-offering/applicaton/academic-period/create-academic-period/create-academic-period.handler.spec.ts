import { CreateAcademicPeriodHandler } from '#academic-offering/applicaton/academic-period/create-academic-period/create-academic-period.handler';
import { AcademicPeriodRepository } from '#academic-offering/domain/repository/academic-period.repository';
import { ExaminationCallRepository } from '#academic-offering/domain/repository/examination-call.repository';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { getABusinessUnit, getAnAdminUser } from '#test/entity-factory';
import { CreateAcademicPeriodCommand } from '#academic-offering/applicaton/academic-period/create-academic-period/create-academic-period.command';
import { v4 as uuid } from 'uuid';
import { AcademicPeriodMockRepository } from '#test/mocks/sga/academic-offering/academic-period.mock-repository';
import { ExaminationCallMockRepository } from '#test/mocks/sga/academic-offering/examination-call.mock-repository';
import { getBusinessUnitGetterMock } from '#test/service-factory';
import { AcademicPeriodDuplicatedCodeException } from '#shared/domain/exception/academic-offering/academic-period.duplicated-code.exception';
import { AcademicPeriodNotExaminationCallsException } from '#shared/domain/exception/academic-offering/academic-period.not-examination-calls.exception';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AcademicPeriodWrongBlockNumberException } from '#shared/domain/exception/academic-offering/academic-period.wrong-block-number.exception';
import { TimeZoneEnum } from '#/sga/shared/domain/enum/time-zone.enum';
import { EventDispatcher } from '#shared/domain/event/event-dispatcher.service';
import { EventDispatcherMock } from '#test/mocks/shared/event-dispatcher.mock-service';

let handler: CreateAcademicPeriodHandler;
let repository: AcademicPeriodRepository;
let examinationCallRepository: ExaminationCallRepository;
let businessUnitGetter: BusinessUnitGetter;
let eventDispatcher: EventDispatcher;
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

let existsByCodeSpy: jest.SpyInstance;
let saveAcademicPeriodSpy: jest.SpyInstance;
let saveExaminationCallSpy: jest.SpyInstance;
let getBusinessUnitSpy: jest.SpyInstance;
let dispatchEventSpy: jest.SpyInstance;

describe('Create Academic Period Handler test', () => {
  beforeAll(() => {
    repository = new AcademicPeriodMockRepository();
    examinationCallRepository = new ExaminationCallMockRepository();
    businessUnitGetter = getBusinessUnitGetterMock();
    eventDispatcher = new EventDispatcherMock();
    handler = new CreateAcademicPeriodHandler(
      repository,
      examinationCallRepository,
      businessUnitGetter,
      eventDispatcher,
    );
    existsByCodeSpy = jest.spyOn(repository, 'existsByCode');
    getBusinessUnitSpy = jest.spyOn(businessUnitGetter, 'getByAdminUser');
    saveAcademicPeriodSpy = jest.spyOn(repository, 'save');
    saveExaminationCallSpy = jest.spyOn(examinationCallRepository, 'save');
    dispatchEventSpy = jest.spyOn(eventDispatcher, 'dispatch');
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
    expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
