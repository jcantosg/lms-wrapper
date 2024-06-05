import { SubjectCallGetter } from '#student/domain/service/subject-call.getter.service';
import { SubjectCallRepository } from '#student/domain/repository/subject-call.repository';
import { SubjectCallMockRepository } from '#test/mocks/sga/academic-offering/subject-call.mock-repository';
import { SubjectCallNotFoundException } from '#shared/domain/exception/subject-call/subject-call.not-found.exception';
import { getAnAdminUser, getATakenSubjectCall } from '#test/entity-factory';

let service: SubjectCallGetter;
let repository: SubjectCallRepository;
let getByAdminUserSpy: jest.SpyInstance;

const subjectCall = getATakenSubjectCall();
const adminUser = getAnAdminUser();

describe('Subject Call Getter Service Unit Test', () => {
  beforeAll(() => {
    repository = new SubjectCallMockRepository();
    service = new SubjectCallGetter(repository);
    getByAdminUserSpy = jest.spyOn(repository, 'getByAdminUser');
  });

  it('should throw a SubjectCallNotFoundException', () => {
    getByAdminUserSpy.mockImplementation(() => Promise.resolve(null));

    expect(service.getByAdminUser(subjectCall.id, adminUser)).rejects.toThrow(
      SubjectCallNotFoundException,
    );
  });

  it('should return a subject call', async () => {
    getByAdminUserSpy.mockImplementation(() => Promise.resolve(subjectCall));
    const response = await service.getByAdminUser(subjectCall.id, adminUser);

    expect(response).toBe(subjectCall);
  });
});
