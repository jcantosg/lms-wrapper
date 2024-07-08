import { CreateEnrollmentHandler } from '#student/application/enrollment/create-enrollment/create-enrollment.handler';
import { AcademicRecordGetter } from '#student/domain/service/academic-record-getter.service';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { TransactionalService } from '#shared/domain/service/transactional-service.service';
import {
  getAnAcademicProgram,
  getAnAcademicRecord,
  getAnAdminUser,
  getAnInternalGroup,
  getAProgramBlock,
  getASubject,
} from '#test/entity-factory';
import { CreateEnrollmentCommand } from '#student/application/enrollment/create-enrollment/create-enrollment.command';
import { v4 as uuid } from 'uuid';
import {
  getAnAcademicRecordGetterMock,
  getASubjectGetterMock,
} from '#test/service-factory';
import { TransactionalServiceMock } from '#test/mocks/shared/transactional-service-mock';
import { SubjectCallFinalGradeEnum } from '#student/domain/enum/enrollment/subject-call-final-grade.enum';
import clearAllMocks = jest.clearAllMocks;
import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { InternalGroupMockRepository } from '#test/mocks/sga/student/internal-group.mock-repository';

let handler: CreateEnrollmentHandler;
let academicRecordGetter: AcademicRecordGetter;
let subjectGetter: SubjectGetter;
let transactionalService: TransactionalService;
let internalGroupRepository: InternalGroupRepository;

let getAcademicRecordSpy: jest.SpyInstance;
let getSubjectSpy: jest.SpyInstance;
let executeSpy: jest.SpyInstance;
let getInternalGroupsSpy: jest.SpyInstance;

const academicRecord = getAnAcademicRecord();
const subject = getASubject();
const programBlock = getAProgramBlock();
academicRecord.academicProgram = getAnAcademicProgram();
academicRecord.academicProgram.programBlocks.push(programBlock);
programBlock.subjects.push(subject);

const internalGroup = getAnInternalGroup(
  academicRecord.academicPeriod,
  academicRecord.academicProgram,
  academicRecord.academicPeriod.periodBlocks[0],
  subject,
);

const command = new CreateEnrollmentCommand(
  [
    {
      enrollmentId: uuid(),
      subjectId: subject.id,
    },
  ],
  academicRecord.id,
  getAnAdminUser(),
);
describe('Create Enrollment Unit Test', () => {
  beforeAll(() => {
    academicRecordGetter = getAnAcademicRecordGetterMock();
    subjectGetter = getASubjectGetterMock();
    transactionalService = new TransactionalServiceMock();
    internalGroupRepository = new InternalGroupMockRepository();
    handler = new CreateEnrollmentHandler(
      academicRecordGetter,
      subjectGetter,
      transactionalService,
      internalGroupRepository,
    );
    getAcademicRecordSpy = jest.spyOn(academicRecordGetter, 'getByAdminUser');
    getSubjectSpy = jest.spyOn(subjectGetter, 'getByAdminUser');
    executeSpy = jest.spyOn(transactionalService, 'execute');
    getInternalGroupsSpy = jest.spyOn(internalGroupRepository, 'getByKeys');
  });
  it('should create an enrollment', async () => {
    getAcademicRecordSpy.mockImplementation(() =>
      Promise.resolve(academicRecord),
    );
    getSubjectSpy.mockImplementation(() => Promise.resolve(subject));
    getInternalGroupsSpy.mockImplementation(() =>
      Promise.resolve([internalGroup]),
    );

    await handler.handle(command);
    expect(executeSpy).toHaveBeenCalledTimes(1);
    expect(executeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        subjectCall: expect.objectContaining({
          finalGrade: SubjectCallFinalGradeEnum.ONGOING,
        }),
      }),
    );
  });

  afterAll(() => {
    clearAllMocks();
  });
});
