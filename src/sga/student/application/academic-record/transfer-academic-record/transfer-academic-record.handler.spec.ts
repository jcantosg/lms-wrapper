import { v4 as uuid } from 'uuid';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { VirtualCampusGetter } from '#business-unit/domain/service/virtual-campus-getter.service';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import {
  getACreateAdministrativeProcessHandlerMock,
  getAUpdateAdministrativeGroupsServiceMock,
  getAUpdateInternalGroupsServiceMock,
  getAnAcademicPeriodGetterMock,
  getAnAcademicProgramGetterMock,
  getAnAcademicRecordGetterMock,
  getAnEnrollmentCreatorMock,
  getAnEnrollmentGetterMock,
  getBusinessUnitGetterMock,
  getVirtualCampusGetterMock,
} from '#test/service-factory';
import {
  getABusinessUnit,
  getAnAcademicPeriod,
  getAnAcademicProgram,
  getAnAcademicRecord,
  getAnAdminUser,
  getAnEnrollment,
  getASubject,
  getATakenSubjectCall,
  getAVirtualCampus,
} from '#test/entity-factory';
import { AcademicRecordModalityEnum } from '#student/domain/enum/academic-record-modality.enum';
import { VirtualCampusNotFoundException } from '#shared/domain/exception/business-unit/virtual-campus/virtual-campus-not-found.exception';
import { AcademicProgramNotFoundException } from '#shared/domain/exception/academic-offering/academic-program.not-found.exception';
import { TransferAcademicRecordHandler } from '#student/application/academic-record/transfer-academic-record/transfer-academic-record.handler';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { FileManager } from '#shared/domain/file-manager/file-manager';
import { EnrollmentCreator } from '#student/domain/service/enrollment-creator.service';
import { EnrollmentGetter } from '#student/domain/service/enrollment-getter.service';
import { TransactionalService } from '#shared/domain/service/transactional-service.service';
import { TransactionalServiceMock } from '#test/mocks/shared/transactional-service-mock';
import { LocalStorageManager } from '#shared/infrastructure/file-manager/local-storage-manager';
import { TransferAcademicRecordCommand } from '#student/application/academic-record/transfer-academic-record/transfer-academic-record.command';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { AcademicRecordNotFoundException } from '#student/shared/exception/academic-record.not-found.exception';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { BusinessUnitNotFoundException } from '#shared/domain/exception/business-unit/business-unit/business-unit-not-found.exception';
import { File } from '#shared/domain/file-manager/file';
import { AcademicRecordTransfer } from '#student/domain/entity/academic-record-transfer.entity';
import { AcademicProgramNotIncludedInAcademicPeriodException } from '#shared/domain/exception/academic-offering/academic-program.not-included-in-academic-period.exception';
import { UUIDGeneratorService } from '#shared/domain/service/uuid-service';
import { UUIDv4GeneratorService } from '#shared/infrastructure/service/uuid-v4.service';
import { UpdateInternalGroupsService } from '#student/domain/service/update-internal-groups.service';
import { UpdateAdministrativeGroupsService } from '#student/domain/service/update-administrative-groups.service';
import { EventDispatcher } from '#shared/domain/event/event-dispatcher.service';
import { EventDispatcherMock } from '#test/mocks/shared/event-dispatcher.mock-service';
import { CreateAdministrativeProcessHandler } from '#student/application/administrative-process/create-administrative-process/create-administrative-process.handler';
import { AcademicRecordStatusEnum } from '#student/domain/enum/academic-record-status.enum';
import { AcademicRecordCancelledException } from '#shared/domain/exception/sga-student/academic-record-cancelled.exception';

let handler: TransferAcademicRecordHandler;
let businessUnitGetter: BusinessUnitGetter;
let virtualCampusGetter: VirtualCampusGetter;
let academicPeriodGetter: AcademicPeriodGetter;
let academicProgramGetter: AcademicProgramGetter;
let transactionalService: TransactionalService;
let academicRecordGetter: AcademicRecordGetter;
let fileManager: FileManager;
let enrollmentCreatorService: EnrollmentCreator;
let enrollmentGetter: EnrollmentGetter;
let uuidGenerator: UUIDGeneratorService;
let updateInternalGroupsService: UpdateInternalGroupsService;
let updateAdministrativeGroupsService: UpdateAdministrativeGroupsService;
let eventDispatcher: EventDispatcher;
let createAdministrativeProcessHandler: CreateAdministrativeProcessHandler;

let getAcademicRecordSpy: jest.SpyInstance;
let getBusinessUnitSpy: jest.SpyInstance;
let getVirtualCampusSpy: jest.SpyInstance;
let getAcademicPeriodSpy: jest.SpyInstance;
let getAcademicProgramSpy: jest.SpyInstance;
let uploadFileSpy: jest.SpyInstance;
let createEnrollmentsSpy: jest.SpyInstance;
let getEnrollmentsSpy: jest.SpyInstance;
let executeTransactionSpy: jest.SpyInstance;
let updateInternalGroupsSpy: jest.SpyInstance;
let updateAdministrativeGroupsSpy: jest.SpyInstance;
let createAdministrativeProcessSpy: jest.SpyInstance;

const oldAcademicRecord = getAnAcademicRecord();
const newAcademicRecord = getAnAcademicRecord();
const businessUnit = getABusinessUnit();
const virtualCampus = getAVirtualCampus();
virtualCampus.businessUnit = businessUnit;
const wrongVirtualCampus = getAVirtualCampus();
const academicPeriod = getAnAcademicPeriod();
const academicProgram = getAnAcademicProgram();
const wrongAcademicPeriod = getAnAcademicPeriod();
const wrongAcademicProgram = getAnAcademicProgram();
academicProgram.businessUnit = businessUnit;
academicProgram.academicPeriods = [academicPeriod];
academicPeriod.businessUnit = businessUnit;
academicPeriod.academicPrograms = [academicProgram];
const adminUser = getAnAdminUser();
const subject = getASubject();
const newEnrollment = getAnEnrollment();
newEnrollment.subject = subject;
newEnrollment.calls = [];
const oldEnrollment = getAnEnrollment();
oldEnrollment.subject = subject;
oldEnrollment.calls = [getATakenSubjectCall()];

const command = new TransferAcademicRecordCommand(
  oldAcademicRecord.id,
  newAcademicRecord.id,
  businessUnit.id,
  virtualCampus.id,
  academicPeriod.id,
  academicProgram.id,
  AcademicRecordModalityEnum.ELEARNING,
  true,
  'comentarios varios',
  [new File('directory', 'filename', Buffer.from('test'), 'jpg')],
  adminUser,
);

describe('Transfer Academic Record Handler', () => {
  beforeAll(() => {
    businessUnitGetter = getBusinessUnitGetterMock();
    virtualCampusGetter = getVirtualCampusGetterMock();
    academicPeriodGetter = getAnAcademicPeriodGetterMock();
    academicProgramGetter = getAnAcademicProgramGetterMock();
    transactionalService = new TransactionalServiceMock();
    academicRecordGetter = getAnAcademicRecordGetterMock();
    fileManager = new LocalStorageManager();
    enrollmentCreatorService = getAnEnrollmentCreatorMock();
    enrollmentGetter = getAnEnrollmentGetterMock();
    uuidGenerator = new UUIDv4GeneratorService();
    updateInternalGroupsService = getAUpdateInternalGroupsServiceMock();
    updateAdministrativeGroupsService =
      getAUpdateAdministrativeGroupsServiceMock();
    eventDispatcher = new EventDispatcherMock();
    createAdministrativeProcessHandler =
      getACreateAdministrativeProcessHandlerMock();

    getAcademicRecordSpy = jest.spyOn(academicRecordGetter, 'getByAdminUser');
    getBusinessUnitSpy = jest.spyOn(businessUnitGetter, 'getByAdminUser');
    getVirtualCampusSpy = jest.spyOn(virtualCampusGetter, 'get');
    getAcademicPeriodSpy = jest.spyOn(academicPeriodGetter, 'getByAdminUser');
    getAcademicProgramSpy = jest.spyOn(academicProgramGetter, 'getByAdminUser');
    uploadFileSpy = jest.spyOn(fileManager, 'uploadFile');
    createEnrollmentsSpy = jest.spyOn(
      enrollmentCreatorService,
      'createForAcademicRecord',
    );
    getEnrollmentsSpy = jest.spyOn(enrollmentGetter, 'getByAcademicRecord');
    executeTransactionSpy = jest.spyOn(transactionalService, 'execute');
    updateInternalGroupsSpy = jest.spyOn(updateInternalGroupsService, 'update');
    updateAdministrativeGroupsSpy = jest.spyOn(
      updateAdministrativeGroupsService,
      'update',
    );
    createAdministrativeProcessSpy = jest.spyOn(
      createAdministrativeProcessHandler,
      'handle',
    );

    handler = new TransferAcademicRecordHandler(
      businessUnitGetter,
      virtualCampusGetter,
      academicPeriodGetter,
      academicProgramGetter,
      transactionalService,
      academicRecordGetter,
      fileManager,
      enrollmentCreatorService,
      enrollmentGetter,
      uuidGenerator,
      updateInternalGroupsService,
      updateAdministrativeGroupsService,
      eventDispatcher,
      createAdministrativeProcessHandler,
    );
  });

  it('should return 404 old academic record not found', async () => {
    getAcademicRecordSpy.mockImplementation((): Promise<AcademicRecord> => {
      throw new AcademicRecordNotFoundException();
    });

    await expect(handler.handle(command)).rejects.toThrow(
      AcademicRecordNotFoundException,
    );
  });

  it('should throw an error if the old academic record is cancelled', async () => {
    getAcademicRecordSpy.mockImplementation(
      (): Promise<AcademicRecord> => Promise.resolve(oldAcademicRecord),
    );
    oldAcademicRecord.status = AcademicRecordStatusEnum.CANCELLED;

    await expect(handler.handle(command)).rejects.toThrow(
      AcademicRecordCancelledException,
    );
  });

  it('should return 404 business unit not found', async () => {
    getAcademicRecordSpy.mockImplementation(
      (): Promise<AcademicRecord> => Promise.resolve(oldAcademicRecord),
    );
    oldAcademicRecord.status = AcademicRecordStatusEnum.VALID;
    getBusinessUnitSpy.mockImplementation((): Promise<BusinessUnit> => {
      throw new BusinessUnitNotFoundException();
    });

    await expect(handler.handle(command)).rejects.toThrow(
      BusinessUnitNotFoundException,
    );
  });

  it('should return 404 virtual campus not found', async () => {
    getAcademicRecordSpy.mockImplementation(
      (): Promise<AcademicRecord> => Promise.resolve(oldAcademicRecord),
    );
    getBusinessUnitSpy.mockImplementation(() => Promise.resolve(businessUnit));
    getVirtualCampusSpy.mockImplementation(() =>
      Promise.resolve(wrongVirtualCampus),
    );

    await expect(handler.handle(command)).rejects.toThrow(
      VirtualCampusNotFoundException,
    );
  });

  it('should return 404 academic period not found', async () => {
    getAcademicRecordSpy.mockImplementation(
      (): Promise<AcademicRecord> => Promise.resolve(oldAcademicRecord),
    );
    getBusinessUnitSpy.mockImplementation(() => Promise.resolve(businessUnit));
    getVirtualCampusSpy.mockImplementation(() =>
      Promise.resolve(virtualCampus),
    );
    getAcademicPeriodSpy.mockImplementation(() =>
      Promise.resolve(wrongAcademicPeriod),
    );
    getAcademicProgramSpy.mockImplementation(() =>
      Promise.resolve(academicProgram),
    );

    await expect(handler.handle(command)).rejects.toThrow(
      AcademicProgramNotIncludedInAcademicPeriodException,
    );
  });

  it('should return 404 academic program not found', async () => {
    getAcademicRecordSpy.mockImplementation(
      (): Promise<AcademicRecord> => Promise.resolve(oldAcademicRecord),
    );
    getBusinessUnitSpy.mockImplementation(() => Promise.resolve(businessUnit));
    getVirtualCampusSpy.mockImplementation(() =>
      Promise.resolve(virtualCampus),
    );
    getAcademicPeriodSpy.mockImplementation(() =>
      Promise.resolve(academicPeriod),
    );
    getAcademicProgramSpy.mockImplementation(() =>
      Promise.resolve(wrongAcademicProgram),
    );

    await expect(handler.handle(command)).rejects.toThrow(
      AcademicProgramNotFoundException,
    );
  });

  it('should execute transaction', async () => {
    getAcademicRecordSpy.mockImplementation(
      (): Promise<AcademicRecord> => Promise.resolve(oldAcademicRecord),
    );
    getBusinessUnitSpy.mockImplementation(() => Promise.resolve(businessUnit));
    getVirtualCampusSpy.mockImplementation(() =>
      Promise.resolve(virtualCampus),
    );
    getAcademicPeriodSpy.mockImplementation(() =>
      Promise.resolve(academicPeriod),
    );
    getAcademicProgramSpy.mockImplementation(() =>
      Promise.resolve(academicProgram),
    );

    uploadFileSpy.mockImplementation(() => Promise.resolve('url'));
    createEnrollmentsSpy.mockImplementation(() =>
      Promise.resolve([newEnrollment]),
    );
    getEnrollmentsSpy.mockImplementation(() =>
      Promise.resolve([oldEnrollment]),
    );
    updateInternalGroupsSpy.mockImplementation(() => Promise.resolve([]));
    updateAdministrativeGroupsSpy.mockImplementation(() => Promise.resolve([]));
    createAdministrativeProcessSpy.mockImplementation(() => Promise.resolve());

    const academicRecordTransfer = AcademicRecordTransfer.create(
      uuid(),
      command.adminUser,
      oldAcademicRecord,
      newAcademicRecord,
      command.comments,
      ['uuid'],
    );

    await handler.handle(command);
    expect(executeTransactionSpy).toHaveBeenCalledTimes(1);
    expect(executeTransactionSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        oldAcademicRecord,
        newAcademicRecord: expect.objectContaining({
          id: newAcademicRecord.id,
          businessUnit,
          virtualCampus,
          student: oldAcademicRecord.student,
          academicPeriod,
          academicProgram,
          modality: command.modality,
          isModular: command.isModular,
        }),
        academicRecordTransfer: expect.objectContaining({
          _comments: academicRecordTransfer.comments,
        }),
        enrollments: [
          expect.objectContaining({
            calls: expect.arrayContaining([
              expect.objectContaining({
                callNumber: 2,
                finalGrade: '8',
              }),
            ]),
          }),
        ],
      }),
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
