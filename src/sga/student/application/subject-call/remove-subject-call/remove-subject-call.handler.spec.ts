import { RemoveSubjectCallHandler } from '#student/application/subject-call/remove-subject-call/remove-subject-call.handler';
import { SubjectCallRepository } from '#student/domain/repository/subject-call.repository';
import { SubjectCallGetter } from '#student/domain/service/subject-call.getter.service';
import {
  getAnAcademicRecord,
  getAnAdminUser,
  getAnEnrollment,
  getATakenSubjectCall,
} from '#test/entity-factory';
import { SubjectCallMockRepository } from '#test/mocks/sga/academic-offering/subject-call.mock-repository';
import { getASubjectCallGetterMock } from '#test/service-factory';
import { RemoveSubjectCallCommand } from '#student/application/subject-call/remove-subject-call/remove-subject-call.command';
import { SubjectCallAlreadyEvaluatedException } from '#shared/domain/exception/subject-call/subject-call.already-evaluated.exception';
import { SubjectCallFinalGradeEnum } from '#student/domain/enum/enrollment/subject-call-final-grade.enum';
import { SubjectCallStatusEnum } from '#student/domain/enum/enrollment/subject-call-status.enum';
import { AcademicRecordStatusEnum } from '#student/domain/enum/academic-record-status.enum';
import { AcademicRecordCancelledException } from '#shared/domain/exception/sga-student/academic-record-cancelled.exception';

let handler: RemoveSubjectCallHandler;
let repository: SubjectCallRepository;
let subjectCallGetter: SubjectCallGetter;

let deleteSpy: jest.SpyInstance;
let getByAdminUserSpy: jest.SpyInstance;

const subjectCall = getATakenSubjectCall();
subjectCall.enrollment = getAnEnrollment();
subjectCall.enrollment.academicRecord = getAnAcademicRecord();
const adminUser = getAnAdminUser();

const command = new RemoveSubjectCallCommand(subjectCall.id, adminUser);

describe('Remove Subject Call Handler', () => {
  beforeAll(() => {
    repository = new SubjectCallMockRepository();
    subjectCallGetter = getASubjectCallGetterMock();
    getByAdminUserSpy = jest.spyOn(subjectCallGetter, 'getByAdminUser');
    deleteSpy = jest.spyOn(repository, 'delete');

    handler = new RemoveSubjectCallHandler(repository, subjectCallGetter);
  });

  it('should throw an error if the academic record is cancelled', async () => {
    getByAdminUserSpy.mockImplementation(() => Promise.resolve(subjectCall));
    subjectCall.enrollment.academicRecord.status =
      AcademicRecordStatusEnum.CANCELLED;

    await expect(handler.handle(command)).rejects.toThrow(
      AcademicRecordCancelledException,
    );
  });

  it('should throw an error if the subject call has already been evaluated', async () => {
    getByAdminUserSpy.mockImplementation(() => Promise.resolve(subjectCall));
    subjectCall.enrollment.academicRecord.status =
      AcademicRecordStatusEnum.VALID;

    await expect(handler.handle(command)).rejects.toThrow(
      SubjectCallAlreadyEvaluatedException,
    );
  });

  it('should remove the subject call', async () => {
    getByAdminUserSpy.mockImplementation(() => Promise.resolve(subjectCall));

    subjectCall.finalGrade = SubjectCallFinalGradeEnum.ONGOING;
    subjectCall.status = SubjectCallStatusEnum.ONGOING;

    await handler.handle(command);

    expect(deleteSpy).toHaveBeenCalledTimes(1);
    expect(deleteSpy).toHaveBeenCalledWith(subjectCall);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
