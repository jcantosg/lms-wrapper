import { AddSubjectCallHandler } from '#student/application/subject-call/add-subject-call/add-subject-call.handler';
import { SubjectCallRepository } from '#student/domain/repository/subject-call.repository';
import { EnrollmentGetter } from '#student/domain/service/enrollment-getter.service';
import {
  getAnAcademicRecord,
  getAnAdminUser,
  getAnEnrollment,
  getATakenSubjectCall,
} from '#test/entity-factory';
import { AddSubjectCallCommand } from '#student/application/subject-call/add-subject-call/add-subject-call.command';
import { SubjectCallMockRepository } from '#test/mocks/sga/academic-offering/subject-call.mock-repository';
import { getAnEnrollmentGetterMock } from '#test/service-factory';
import { SubjectCallDuplicatedException } from '#shared/domain/exception/sga-student/subject-call/subject-call-duplicated.exception';
import { SubjectCallFinalGradeEnum } from '#student/domain/enum/enrollment/subject-call-final-grade.enum';
import { SubjectCallStatusEnum } from '#student/domain/enum/enrollment/subject-call-status.enum';
import { SubjectCallNotTakenException } from '#shared/domain/exception/subject-call/subject-call.not-taken.exception';
import { SubjectCallAlreadyPassedException } from '#shared/domain/exception/subject-call/subject-call.already-passed.exception';
import { SubjectCallMaxReachedException } from '#shared/domain/exception/subject-call/subject-call.max-reached.exception';
import { AcademicRecordStatusEnum } from '#student/domain/enum/academic-record-status.enum';
import { AcademicRecordCancelledException } from '#shared/domain/exception/sga-student/academic-record-cancelled.exception';

let handler: AddSubjectCallHandler;
let repository: SubjectCallRepository;
let enrollmentGetter: EnrollmentGetter;

let saveSpy: jest.SpyInstance;
let getByAdminUserSpy: jest.SpyInstance;
let existsByIdSpy: jest.SpyInstance;

const academicRecord = getAnAcademicRecord();
const subjectCall = getATakenSubjectCall();
const enrollment = getAnEnrollment();
const adminUser = getAnAdminUser();
enrollment.academicRecord = academicRecord;

const command = new AddSubjectCallCommand(
  enrollment.id,
  subjectCall.id,
  adminUser,
);

describe('Add Subject Call Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  beforeAll(() => {
    repository = new SubjectCallMockRepository();
    enrollmentGetter = getAnEnrollmentGetterMock();
    getByAdminUserSpy = jest.spyOn(enrollmentGetter, 'getByAdminUser');
    existsByIdSpy = jest.spyOn(repository, 'existsById');
    saveSpy = jest.spyOn(repository, 'save');

    handler = new AddSubjectCallHandler(repository, enrollmentGetter);
  });

  it('should throw an error if the subject call already exists', async () => {
    existsByIdSpy.mockImplementation(() => Promise.resolve(true));

    await expect(handler.handle(command)).rejects.toThrow(
      SubjectCallDuplicatedException,
    );
  });

  it('should throw an error if the academic record is cancelled', async () => {
    existsByIdSpy.mockImplementation(() => Promise.resolve(false));
    getByAdminUserSpy.mockImplementation(() => Promise.resolve(enrollment));
    enrollment.academicRecord.status = AcademicRecordStatusEnum.CANCELLED;

    await expect(handler.handle(command)).rejects.toThrow(
      AcademicRecordCancelledException,
    );
  });

  it('should add a subject call with call number 1', async () => {
    existsByIdSpy.mockImplementation(() => Promise.resolve(false));
    getByAdminUserSpy.mockImplementation(() => Promise.resolve(enrollment));
    enrollment.academicRecord.status = AcademicRecordStatusEnum.VALID;
    await handler.handle(command);

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: command.subjectCallId,
        enrollment,
        callNumber: 1,
      }),
    );
  });

  it('should throw an error if the subject call is not taken', async () => {
    existsByIdSpy.mockImplementation(() => Promise.resolve(false));
    getByAdminUserSpy.mockImplementation(() => Promise.resolve(enrollment));
    enrollment.calls = [subjectCall];
    subjectCall.finalGrade = SubjectCallFinalGradeEnum.ONGOING;
    subjectCall.status = SubjectCallStatusEnum.ONGOING;

    await expect(handler.handle(command)).rejects.toThrow(
      SubjectCallNotTakenException,
    );
  });

  it('should throw an error if the subject call is passed', async () => {
    existsByIdSpy.mockImplementation(() => Promise.resolve(false));
    getByAdminUserSpy.mockImplementation(() => Promise.resolve(enrollment));
    enrollment.calls = [subjectCall];
    subjectCall.finalGrade = SubjectCallFinalGradeEnum.FIVE;
    subjectCall.status = SubjectCallStatusEnum.PASSED;

    await expect(handler.handle(command)).rejects.toThrow(
      SubjectCallAlreadyPassedException,
    );
  });

  it('should add a subject call with call number 1 with before call status renounced', async () => {
    existsByIdSpy.mockImplementation(() => Promise.resolve(false));
    getByAdminUserSpy.mockImplementation(() => Promise.resolve(enrollment));
    enrollment.calls = [subjectCall];
    subjectCall.callNumber = 1;
    subjectCall.finalGrade = SubjectCallFinalGradeEnum.RC;
    subjectCall.status = SubjectCallStatusEnum.RENOUNCED;

    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: command.subjectCallId,
        enrollment,
        callNumber: 1,
      }),
    );
  });

  it('should add a subject call with call number 2', async () => {
    existsByIdSpy.mockImplementation(() => Promise.resolve(false));
    getByAdminUserSpy.mockImplementation(() => Promise.resolve(enrollment));

    enrollment.calls = [subjectCall];
    subjectCall.callNumber = 1;
    subjectCall.finalGrade = SubjectCallFinalGradeEnum.THREE;
    subjectCall.status = SubjectCallStatusEnum.NOT_PASSED;

    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: command.subjectCallId,
        enrollment,
        callNumber: 2,
      }),
    );
  });

  it('should throw an error if the subject call max calls is reached', async () => {
    existsByIdSpy.mockImplementation(() => Promise.resolve(false));
    getByAdminUserSpy.mockImplementation(() => Promise.resolve(enrollment));

    enrollment.calls = [subjectCall];
    enrollment.maxCalls = 1;
    subjectCall.callNumber = 1;
    subjectCall.finalGrade = SubjectCallFinalGradeEnum.THREE;
    subjectCall.status = SubjectCallStatusEnum.NOT_PASSED;

    await expect(handler.handle(command)).rejects.toThrow(
      SubjectCallMaxReachedException,
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
