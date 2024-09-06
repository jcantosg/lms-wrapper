import { DeleteEnrollmentHandler } from '#student/application/enrollment/delete-enrollment/delete-enrollment.handler';
import {
  getALmsEnrollment,
  getAnAcademicRecord,
  getAnEnrollment,
  getANotTakenSubjectCall,
  getASGAStudent,
  getASubject,
  getATakenSubjectCall,
} from '#test/entity-factory';
import { EnrollmentRepository } from '#student/domain/repository/enrollment.repository';
import { EnrollmentGetter } from '#student/domain/service/enrollment-getter.service';
import { SubjectCallRepository } from '#student/domain/repository/subject-call.repository';
import { DeleteEnrollmentCommand } from '#student/application/enrollment/delete-enrollment/delete-enrollment.command';
import { EnrollmentMockRepository } from '#test/mocks/sga/student/enrollment.mock-repository';
import { getAnEnrollmentGetterMock } from '#test/service-factory';
import { SubjectCallMockRepository } from '#test/mocks/sga/academic-offering/subject-call.mock-repository';
import { EnrollmentNotFoundException } from '#student/shared/exception/enrollment-not-found.exception';
import { EnrollmentSubjectCallsTakenException } from '#shared/domain/exception/academic-offering/enrollment.subject-calls-taken.exception';
import { DeleteLmsEnrollmentHandler } from '#lms-wrapper/application/delete-lms-enrollment/delete-lms-enrollment.handler';
import { LmsEnrollmentMockRepository } from '#test/mocks/lms-wrapper/lms-enrollment.mock-repository';
import { getALmsCourse, getALmsStudent } from '#test/value-object-factory';
import clearAllMocks = jest.clearAllMocks;
import { AcademicRecordStatusEnum } from '#student/domain/enum/academic-record-status.enum';
import { AcademicRecordCancelledException } from '#shared/domain/exception/sga-student/academic-record-cancelled.exception';

let handler: DeleteEnrollmentHandler;
let enrollmentGetter: EnrollmentGetter;
let repository: EnrollmentRepository;
let subjectCallRepository: SubjectCallRepository;
let deleteLmsEnrollmentHandler: DeleteLmsEnrollmentHandler;
let getEnrollmentSpy: jest.SpyInstance;
let deleteEnrollmentSpy: jest.SpyInstance;
let deleteSubjectCallSpy: jest.SpyInstance;
let deleteLmsEnrollmentSpy: jest.SpyInstance;

const enrollment = getAnEnrollment();
const subjectCallNotTaken = getANotTakenSubjectCall();
enrollment.addSubjectCall(subjectCallNotTaken);
enrollment.lmsEnrollment = getALmsEnrollment();
enrollment.academicRecord = getAnAcademicRecord();
enrollment.academicRecord.student = getASGAStudent();
enrollment.academicRecord.student.lmsStudent = getALmsStudent();
enrollment.subject = getASubject();
enrollment.subject.lmsCourse = getALmsCourse(1, 'TEST');

const enrollmentTaken = getAnEnrollment();
enrollmentTaken.lmsEnrollment = getALmsEnrollment();
enrollmentTaken.addSubjectCall(getATakenSubjectCall());
enrollmentTaken.addSubjectCall(getATakenSubjectCall());

const command = new DeleteEnrollmentCommand(enrollment.id);

describe('Delete enrollment handler', () => {
  beforeAll(() => {
    repository = new EnrollmentMockRepository();
    subjectCallRepository = new SubjectCallMockRepository();
    enrollmentGetter = getAnEnrollmentGetterMock();
    deleteLmsEnrollmentHandler = new DeleteLmsEnrollmentHandler(
      new LmsEnrollmentMockRepository(),
    );
    handler = new DeleteEnrollmentHandler(
      enrollmentGetter,
      repository,
      subjectCallRepository,
      deleteLmsEnrollmentHandler,
    );
    getEnrollmentSpy = jest.spyOn(enrollmentGetter, 'get');
    deleteEnrollmentSpy = jest.spyOn(repository, 'delete');
    deleteSubjectCallSpy = jest.spyOn(subjectCallRepository, 'delete');
    deleteLmsEnrollmentSpy = jest.spyOn(deleteLmsEnrollmentHandler, 'handle');
  });

  it('should throw a EnrollmentNotFoundException', () => {
    getEnrollmentSpy.mockImplementation(() => {
      throw new EnrollmentNotFoundException();
    });
    expect(handler.handle(command)).rejects.toThrow(
      EnrollmentNotFoundException,
    );
  });

  it('should throw an AcademicRecordCancelledException', () => {
    getEnrollmentSpy.mockImplementation(() => {
      enrollment.academicRecord.status = AcademicRecordStatusEnum.CANCELLED;

      return Promise.resolve(enrollment);
    });

    expect(handler.handle(command)).rejects.toThrow(
      AcademicRecordCancelledException,
    );
  });

  it('should throw an EnrollmentSubjectCallsTaken exception', () => {
    getEnrollmentSpy.mockImplementation(() => Promise.resolve(enrollmentTaken));
    expect(handler.handle(command)).rejects.toThrow(
      EnrollmentSubjectCallsTakenException,
    );
  });
  it('should delete an enrollment and the subject call', async () => {
    getEnrollmentSpy.mockImplementation(() => Promise.resolve(enrollment));
    enrollment.academicRecord.status = AcademicRecordStatusEnum.VALID;
    await handler.handle(command);
    expect(deleteLmsEnrollmentSpy).toHaveBeenCalledTimes(1);
    expect(deleteEnrollmentSpy).toHaveBeenCalledTimes(1);
    expect(deleteSubjectCallSpy).toHaveBeenCalledTimes(1);
    expect(deleteEnrollmentSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: enrollment.id,
      }),
    );
    expect(deleteSubjectCallSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: subjectCallNotTaken.id,
        status: subjectCallNotTaken.status,
      }),
    );
  });

  afterAll(() => {
    clearAllMocks();
  });
});
