import { DeleteEnrollmentHandler } from '#student/application/enrollment/delete-enrollment/delete-enrollment.handler';
import {
  getAnEnrollment,
  getANotTakenSubjectCall,
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
import clearAllMocks = jest.clearAllMocks;

let handler: DeleteEnrollmentHandler;
let enrollmentGetter: EnrollmentGetter;
let repository: EnrollmentRepository;
let subjectCallRepository: SubjectCallRepository;
let getEnrollmentSpy: jest.SpyInstance;
let deleteEnrollmentSpy: jest.SpyInstance;
let deleteSubjectCallSpy: jest.SpyInstance;

const enrollment = getAnEnrollment();
const subjectCallNotTaken = getANotTakenSubjectCall();
enrollment.addSubjectCall(subjectCallNotTaken);

const enrollmentTaken = getAnEnrollment();
enrollmentTaken.addSubjectCall(getATakenSubjectCall());
enrollmentTaken.addSubjectCall(getATakenSubjectCall());

const command = new DeleteEnrollmentCommand(enrollment.id);

describe('Delete enrollment handler', () => {
  beforeAll(() => {
    repository = new EnrollmentMockRepository();
    subjectCallRepository = new SubjectCallMockRepository();
    enrollmentGetter = getAnEnrollmentGetterMock();
    handler = new DeleteEnrollmentHandler(
      enrollmentGetter,
      repository,
      subjectCallRepository,
    );
    getEnrollmentSpy = jest.spyOn(enrollmentGetter, 'get');
    deleteEnrollmentSpy = jest.spyOn(repository, 'delete');
    deleteSubjectCallSpy = jest.spyOn(subjectCallRepository, 'delete');
  });
  it('should throw a EnrollmentNotFoundException', () => {
    getEnrollmentSpy.mockImplementation(() => {
      throw new EnrollmentNotFoundException();
    });
    expect(handler.handle(command)).rejects.toThrow(
      EnrollmentNotFoundException,
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
    await handler.handle(command);
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
