import { EditSubjectCallHandler } from '#student/application/subject-call/edit-subject-call/edit-subject-call.handler';
import { SubjectCallRepository } from '#student/domain/repository/subject-call.repository';
import { SubjectCallGetter } from '#student/domain/service/subject-call.getter.service';
import {
  getAnAcademicRecord,
  getAnAdminUser,
  getAnEnrollment,
  getATakenSubjectCall,
} from '#test/entity-factory';
import { EditSubjectCallCommand } from '#student/application/subject-call/edit-subject-call/edit-subject-call.command';
import { MonthEnum } from '#/sga/shared/domain/enum/month.enum';
import { SubjectCallFinalGradeEnum } from '#student/domain/enum/enrollment/subject-call-final-grade.enum';
import { SubjectCallMockRepository } from '#test/mocks/sga/academic-offering/subject-call.mock-repository';
import { getASubjectCallGetterMock } from '#test/service-factory';
import { AcademicRecordStatusEnum } from '#student/domain/enum/academic-record-status.enum';
import { AcademicRecordCancelledException } from '#shared/domain/exception/sga-student/academic-record-cancelled.exception';
import { EventDispatcher } from '#shared/domain/event/event-dispatcher.service';
import { EventDispatcherMock } from '#test/mocks/shared/event-dispatcher.mock-service';

let handler: EditSubjectCallHandler;
let repository: SubjectCallRepository;
let subjectCallGetter: SubjectCallGetter;
let eventDispatcher: EventDispatcher;

let saveSpy: jest.SpyInstance;
let getByAdminUserSpy: jest.SpyInstance;
let dispatchEventSpy: jest.SpyInstance;

const subjectCall = getATakenSubjectCall();
subjectCall.enrollment = getAnEnrollment();
subjectCall.enrollment.academicRecord = getAnAcademicRecord();
const adminUser = getAnAdminUser();

const command = new EditSubjectCallCommand(
  subjectCall.id,
  MonthEnum.April,
  2022,
  SubjectCallFinalGradeEnum.EIGHT,
  adminUser,
);

describe('Edit Subject Call Handler', () => {
  beforeAll(() => {
    repository = new SubjectCallMockRepository();
    subjectCallGetter = getASubjectCallGetterMock();
    getByAdminUserSpy = jest.spyOn(subjectCallGetter, 'getByAdminUser');
    saveSpy = jest.spyOn(repository, 'save');
    eventDispatcher = new EventDispatcherMock();
    dispatchEventSpy = jest.spyOn(eventDispatcher, 'dispatch');

    handler = new EditSubjectCallHandler(
      repository,
      subjectCallGetter,
      eventDispatcher,
    );
  });

  it('should throw an error if the academic record is cancelled', async () => {
    getByAdminUserSpy.mockImplementation(() => Promise.resolve(subjectCall));
    subjectCall.enrollment.academicRecord.status =
      AcademicRecordStatusEnum.CANCELLED;

    await expect(handler.handle(command)).rejects.toThrow(
      AcademicRecordCancelledException,
    );
  });

  it('should update a subject call', async () => {
    getByAdminUserSpy.mockImplementation(() => Promise.resolve(subjectCall));
    subjectCall.enrollment.academicRecord.status =
      AcademicRecordStatusEnum.VALID;
    await handler.handle(command);

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: subjectCall.id,
        callDate: subjectCall.callDate,
        finalGrade: command.finalGrade,
      }),
    );
    expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
  });
});
