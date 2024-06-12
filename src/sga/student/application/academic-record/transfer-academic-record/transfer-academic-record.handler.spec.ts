import { v4 as uuid } from 'uuid';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { VirtualCampusGetter } from '#business-unit/domain/service/virtual-campus-getter.service';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import {
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

let getAcademicRecordSpy: jest.SpyInstance;
let getBusinessUnitSpy: jest.SpyInstance;
let getVirtualCampusSpy: jest.SpyInstance;
let getAcademicPeriodSpy: jest.SpyInstance;
let getAcademicProgramSpy: jest.SpyInstance;
let uploadFileSpy: jest.SpyInstance;
let createEnrollmentsSpy: jest.SpyInstance;
let getEnrollmentsSpy: jest.SpyInstance;
let executeTransactionSpy: jest.SpyInstance;

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

  it('should return 404 business unit not found', async () => {
    getAcademicRecordSpy.mockImplementation(
      (): Promise<AcademicRecord> => Promise.resolve(oldAcademicRecord),
    );
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
            calls: oldEnrollment.calls,
          }),
        ],
      }),
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
