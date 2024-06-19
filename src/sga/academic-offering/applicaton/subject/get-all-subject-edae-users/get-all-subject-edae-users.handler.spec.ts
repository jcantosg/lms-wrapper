import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { SubjectNotFoundException } from '#shared/domain/exception/academic-offering/subject.not-found.exception';
import { getASubject, getAnEdaeUser } from '#test/entity-factory';
import { getASubjectGetterMock } from '#test/service-factory';
import { GetAllSubjectEdaeUsersHandler } from '#academic-offering/applicaton/subject/get-all-subject-edae-users/get-all-subject-edae-users.handler';
import { GetAllSubjectEdaeUsersQuery } from '#academic-offering/applicaton/subject/get-all-subject-edae-users/get-all-subject-edae-users.query';

let handler: GetAllSubjectEdaeUsersHandler;
let subjectGetter: SubjectGetter;
let getSpy: any;

const subject = getASubject();
const teachers = [getAnEdaeUser(), getAnEdaeUser(), getAnEdaeUser()];
teachers.forEach((teacher) => subject.addTeacher(teacher));
const query = new GetAllSubjectEdaeUsersQuery(
  subject.id,
  [subject.businessUnit.id],
  true,
);

describe('Get All Subject Edae Users Handler', () => {
  beforeAll(() => {
    subjectGetter = getASubjectGetterMock();
    handler = new GetAllSubjectEdaeUsersHandler(subjectGetter);
    getSpy = jest.spyOn(subjectGetter, 'getByAdminUser');
  });

  it('should return an array of edae users', async () => {
    getSpy.mockImplementation((): Promise<Subject> => {
      return Promise.resolve(subject);
    });
    const edaeUsers = await handler.handle(query);
    expect(edaeUsers).toEqual(teachers);
  });

  it('should throw an SubjectNotFoundException', async () => {
    getSpy.mockImplementation(() => {
      throw new SubjectNotFoundException();
    });
    await expect(handler.handle(query)).rejects.toThrow(
      SubjectNotFoundException,
    );
  });
});
