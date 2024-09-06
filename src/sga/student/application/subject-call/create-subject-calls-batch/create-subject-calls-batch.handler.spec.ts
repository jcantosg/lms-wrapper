import { SubjectCallRepository } from '#student/domain/repository/subject-call.repository';
import { EnrollmentGetter } from '#student/domain/service/enrollment-getter.service';
import {
  getABusinessUnit,
  getAnAcademicPeriod,
  getAnAcademicProgram,
  getAnAdminUser,
  getAnEnrollment,
} from '#test/entity-factory';
import { SubjectCallMockRepository } from '#test/mocks/sga/academic-offering/subject-call.mock-repository';
import {
  getAnAcademicPeriodGetterMock,
  getAnAcademicProgramGetterMock,
  getAnEnrollmentGetterMock,
  getBusinessUnitGetterMock,
} from '#test/service-factory';
import { CreateSubjectCallsBatchHandler } from '#student/application/subject-call/create-subject-calls-batch/create-subject-calls-batch.handler';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { EventDispatcher } from '#shared/domain/event/event-dispatcher.service';
import { EventDispatcherMock } from '#test/mocks/shared/event-dispatcher.mock-service';
import { UUIDGeneratorService } from '#shared/domain/service/uuid-service';
import { UUIDv4GeneratorService } from '#shared/infrastructure/service/uuid-v4.service';
import { CreateSubjectCallsBatchCommand } from '#student/application/subject-call/create-subject-calls-batch/create-subject-calls-batch.command';
import { InvalidAcademicPeriodException } from '#shared/domain/exception/academic-offering/academic-period.invalid.exception';
import { InvalidAcademicProgramException } from '#shared/domain/exception/academic-offering/academic-program.invalid.exception';

let handler: CreateSubjectCallsBatchHandler;
let repository: SubjectCallRepository;
let businessUnitGetter: BusinessUnitGetter;
let academicPeriodGetter: AcademicPeriodGetter;
let academicProgramGetter: AcademicProgramGetter;
let enrollmentGetter: EnrollmentGetter;
let eventDispatcher: EventDispatcher;
const uuidGenerator: UUIDGeneratorService = new UUIDv4GeneratorService();

let saveSpy: jest.SpyInstance;
let getBusinessUnitSpy: jest.SpyInstance;
let getAcademicPeriodSpy: jest.SpyInstance;
let getAcademicProgramSpy: jest.SpyInstance;
let getEnrollmentsSpy: jest.SpyInstance;
let dispatchSpy: jest.SpyInstance;

const businessUnit = getABusinessUnit();
const academicPeriod = getAnAcademicPeriod();
const invalidAcademicPeriod = getAnAcademicPeriod();
academicPeriod.businessUnit = businessUnit;
const academicProgram = getAnAcademicProgram();
const invalidAcademicProgram = getAnAcademicProgram();
academicProgram.academicPeriods = [academicPeriod];
const enrollments = [getAnEnrollment(), getAnEnrollment()];
const adminUser = getAnAdminUser();

const command = new CreateSubjectCallsBatchCommand(
  businessUnit.id,
  academicPeriod.id,
  [academicProgram.id],
  adminUser,
);

describe('Create subject calls batch Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  beforeAll(() => {
    repository = new SubjectCallMockRepository();
    businessUnitGetter = getBusinessUnitGetterMock();
    academicPeriodGetter = getAnAcademicPeriodGetterMock();
    academicProgramGetter = getAnAcademicProgramGetterMock();
    enrollmentGetter = getAnEnrollmentGetterMock();
    eventDispatcher = new EventDispatcherMock();

    getBusinessUnitSpy = jest.spyOn(businessUnitGetter, 'getByAdminUser');
    getAcademicPeriodSpy = jest.spyOn(academicPeriodGetter, 'getByAdminUser');
    getAcademicProgramSpy = jest.spyOn(academicProgramGetter, 'getByAdminUser');
    getEnrollmentsSpy = jest.spyOn(enrollmentGetter, 'getByMultipleSubjects');
    saveSpy = jest.spyOn(repository, 'saveBatch');
    dispatchSpy = jest.spyOn(eventDispatcher, 'dispatch');

    handler = new CreateSubjectCallsBatchHandler(
      repository,
      businessUnitGetter,
      academicPeriodGetter,
      academicProgramGetter,
      enrollmentGetter,
      uuidGenerator,
      eventDispatcher,
    );
  });

  it('should throw a invalid academic period exception', async () => {
    getBusinessUnitSpy.mockImplementation(() => Promise.resolve(businessUnit));
    getAcademicPeriodSpy.mockImplementation(() =>
      Promise.resolve(invalidAcademicPeriod),
    );

    await expect(handler.handle(command)).rejects.toThrow(
      InvalidAcademicPeriodException,
    );
  });

  it('should throw a invalid academic program exception', async () => {
    getBusinessUnitSpy.mockImplementation(() => Promise.resolve(businessUnit));
    getAcademicPeriodSpy.mockImplementation(() =>
      Promise.resolve(academicPeriod),
    );
    getAcademicProgramSpy.mockImplementation(() =>
      Promise.resolve(invalidAcademicProgram),
    );

    await expect(handler.handle(command)).rejects.toThrow(
      InvalidAcademicProgramException,
    );
  });

  it('should create subject calls', async () => {
    getBusinessUnitSpy.mockImplementation(() => Promise.resolve(businessUnit));
    getAcademicPeriodSpy.mockImplementation(() =>
      Promise.resolve(academicPeriod),
    );
    getAcademicProgramSpy.mockImplementation(() =>
      Promise.resolve(academicProgram),
    );
    getEnrollmentsSpy.mockImplementation(() => Promise.resolve(enrollments));
    await handler.handle(command);

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          enrollment: enrollments[0],
        }),
        expect.objectContaining({
          enrollment: enrollments[1],
        }),
      ]),
    );
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        businessUnit,
        academicPeriod,
        academicPrograms: [academicProgram],
        adminUser,
      }),
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
