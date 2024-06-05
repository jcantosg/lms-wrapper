import { EditSubjectCallHandler } from '#student/application/subject-call/edit-subject-call/edit-subject-call.handler';
import { SubjectCallRepository } from '#student/domain/repository/subject-call.repository';
import { SubjectCallGetter } from '#student/domain/service/subject-call.getter.service';
import { getAnAdminUser, getATakenSubjectCall } from '#test/entity-factory';
import { EditSubjectCallCommand } from '#student/application/subject-call/edit-subject-call/edit-subject-call.command';
import { MonthEnum } from '#/sga/shared/domain/enum/month.enum';
import { SubjectCallFinalGradeEnum } from '#student/domain/enum/enrollment/subject-call-final-grade.enum';
import { SubjectCallMockRepository } from '#test/mocks/sga/academic-offering/subject-call.mock-repository';
import { getASubjectCallGetterMock } from '#test/service-factory';

let handler: EditSubjectCallHandler;
let repository: SubjectCallRepository;
let subjectCallGetter: SubjectCallGetter;

let saveSpy: jest.SpyInstance;
let getByAdminUserSpy: jest.SpyInstance;

const subjectCall = getATakenSubjectCall();
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

    handler = new EditSubjectCallHandler(repository, subjectCallGetter);
  });

  it('should update a subject call', async () => {
    getByAdminUserSpy.mockImplementation(() => Promise.resolve(subjectCall));
    await handler.handle(command);

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: subjectCall.id,
        callDate: subjectCall.callDate,
        finalGrade: command.finalGrade,
      }),
    );
  });
});
