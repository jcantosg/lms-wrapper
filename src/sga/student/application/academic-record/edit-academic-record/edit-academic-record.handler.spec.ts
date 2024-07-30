import { EditAcademicRecordHandler } from '#student/application/academic-record/edit-academic-record/edit-academic-record.handler';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { EditAcademicRecordCommand } from '#student/application/academic-record/edit-academic-record/edit-academic-record.command';
import {
  getAnAcademicPeriod,
  getAnAcademicProgram,
  getAnAcademicRecord,
  getAnAdministrativeGroup,
  getAnAdminUser,
  getAnEnrollment,
  getAnInternalGroup,
  getAPeriodBlock,
  getASubject,
} from '#test/entity-factory';
import { AcademicRecordStatusEnum } from '#student/domain/enum/academic-record-status.enum';
import { AcademicRecordModalityEnum } from '#student/domain/enum/academic-record-modality.enum';
import { AcademicRecordMockRepository } from '#test/mocks/sga/student/academic-record.mock-repository';
import {
  getAnAcademicRecordGetterMock,
  getAnEnrollmentGetterMock,
  getAStudentAdministrativeGroupByAcademicRecordGetterMock,
} from '#test/service-factory';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { AcademicRecordCancelledException } from '#shared/domain/exception/sga-student/academic-record-cancelled.exception';
import { StudentAdministrativeGroupByAcademicRecordGetter } from '#student/domain/service/student-administrative-group-by-academic-record.getter.service';
import { EnrollmentGetter } from '#student/domain/service/enrollment-getter.service';
import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { TransactionalService } from '#shared/domain/service/transactional-service.service';
import { InternalGroupMockRepository } from '#test/mocks/sga/student/internal-group.mock-repository';
import { TransactionalServiceMock } from '#test/mocks/shared/transactional-service-mock';
import { AdministrativeGroup } from '#student/domain/entity/administrative-group.entity';
import { Enrollment } from '#student/domain/entity/enrollment.entity';
import { InternalGroup } from '#student/domain/entity/internal-group.entity';

let handler: EditAcademicRecordHandler;
let repository: AcademicRecordRepository;
let academicRecordGetter: AcademicRecordGetter;
let studentAdministrativeGroupGetter: StudentAdministrativeGroupByAcademicRecordGetter;
let enrollmentGetter: EnrollmentGetter;
let internalGroupRepository: InternalGroupRepository;
let transactionalService: TransactionalService;

let getByAdminUserSpy: jest.SpyInstance;
let saveSpy: jest.SpyInstance;
let studentAdministrativeGroupGetterSpy: jest.SpyInstance;
let enrollmentGetterSpy: jest.SpyInstance;
let internalGroupRepositorySpy: jest.SpyInstance;
let executeTransactionSpy: jest.SpyInstance;

const adminUser = getAnAdminUser();
const academicRecord = getAnAcademicRecord();
const administrativeGroup = getAnAdministrativeGroup();
const enrollment = getAnEnrollment();
const subject = getASubject();
const academicPeriod = getAnAcademicPeriod();
const academicProgram = getAnAcademicProgram();
const periodBlock = getAPeriodBlock();
const internalGroup = getAnInternalGroup(
  academicPeriod,
  academicProgram,
  periodBlock,
  subject,
);

const command = new EditAcademicRecordCommand(
  'ca9aa9b2-fc51-4cac-bc94-211efb91b96c',
  AcademicRecordStatusEnum.VALID,
  AcademicRecordModalityEnum.ELEARNING,
  false,
  adminUser,
);

describe('Edit Academic Record Handler', () => {
  beforeAll(() => {
    repository = new AcademicRecordMockRepository();
    academicRecordGetter = getAnAcademicRecordGetterMock();
    studentAdministrativeGroupGetter =
      getAStudentAdministrativeGroupByAcademicRecordGetterMock();
    enrollmentGetter = getAnEnrollmentGetterMock();
    internalGroupRepository = new InternalGroupMockRepository();
    transactionalService = new TransactionalServiceMock();

    getByAdminUserSpy = jest.spyOn(academicRecordGetter, 'getByAdminUser');
    saveSpy = jest.spyOn(repository, 'save');
    studentAdministrativeGroupGetterSpy = jest.spyOn(
      studentAdministrativeGroupGetter,
      'get',
    );
    enrollmentGetterSpy = jest.spyOn(enrollmentGetter, 'getByAcademicRecord');
    internalGroupRepositorySpy = jest.spyOn(
      internalGroupRepository,
      'getAllByStudentAndKeys',
    );
    executeTransactionSpy = jest.spyOn(transactionalService, 'execute');

    handler = new EditAcademicRecordHandler(
      repository,
      academicRecordGetter,
      studentAdministrativeGroupGetter,
      enrollmentGetter,
      internalGroupRepository,
      transactionalService,
    );
  });

  it('should throw an error if the academic record is cancelled', async () => {
    getByAdminUserSpy.mockImplementation(
      (): Promise<AcademicRecord> => Promise.resolve(academicRecord),
    );
    academicRecord.status = AcademicRecordStatusEnum.CANCELLED;

    await expect(handler.handle(command)).rejects.toThrow(
      AcademicRecordCancelledException,
    );
  });

  it('should update an academic record', async () => {
    getByAdminUserSpy.mockImplementation(
      (): Promise<AcademicRecord> => Promise.resolve(academicRecord),
    );
    academicRecord.status = AcademicRecordStatusEnum.VALID;

    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(academicRecord);
  });

  it('should cancel an academic record', async () => {
    const command = new EditAcademicRecordCommand(
      'ca9aa9b2-fc51-4cac-bc94-211efb91b96c',
      AcademicRecordStatusEnum.CANCELLED,
      AcademicRecordModalityEnum.ELEARNING,
      false,
      adminUser,
    );

    getByAdminUserSpy.mockImplementation(
      (): Promise<AcademicRecord> => Promise.resolve(academicRecord),
    );
    studentAdministrativeGroupGetterSpy.mockImplementation(
      (): Promise<AdministrativeGroup> => Promise.resolve(administrativeGroup),
    );
    enrollmentGetterSpy.mockImplementation(
      (): Promise<Enrollment[]> => Promise.resolve([enrollment]),
    );
    internalGroupRepositorySpy.mockImplementation(
      (): Promise<InternalGroup[]> => Promise.resolve([internalGroup]),
    );

    await handler.handle(command);

    expect(executeTransactionSpy).toHaveBeenCalledTimes(1);
    expect(executeTransactionSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        academicRecord: academicRecord,
        administrativeGroup: administrativeGroup,
        internalGroups: [internalGroup],
        enrollments: [enrollment],
      }),
    );
  });
});
