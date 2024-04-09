import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import {
  getABusinessUnit,
  getAnAdminUser,
  getAnEdaeUser,
  getASubject,
} from '#test/entity-factory';
import { SubjectMockRepository } from '#test/mocks/sga/academic-offering/subject.mock-repository';
import {
  getASubjectGetterMock,
  getEdaeUserGetterMock,
} from '#test/service-factory';
import { EdaeUserGetter } from '#edae-user/domain/service/edae-user-getter.service';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { RemoveEdaeUserFromSubjectCommand } from '#academic-offering/applicaton/subject/remove-edae-from-subject/remove-edae-user-from-subject.command';
import { RemoveEdaeUserFromSubjectHandler } from '#academic-offering/applicaton/subject/remove-edae-from-subject/remove-edae-user-from-subject.handler';

let handler: RemoveEdaeUserFromSubjectHandler;
let subjectRepository: SubjectRepository;
let subjectGetter: SubjectGetter;
let edaeUserGetter: EdaeUserGetter;

let getSubjectByAdminUserSpy: any;
let getEdaeUserGetterSpy: any;
let updateSpy: any;

const subject = getASubject();
const edaeUser = getAnEdaeUser();
const user = getAnAdminUser();
const businessUnit = getABusinessUnit();
user.addBusinessUnit(businessUnit);

const command = new RemoveEdaeUserFromSubjectCommand(subject.id, user.id, user);

describe('Remove Edae User from Subject', () => {
  beforeAll(() => {
    subjectRepository = new SubjectMockRepository();
    subjectGetter = getASubjectGetterMock();
    edaeUserGetter = getEdaeUserGetterMock();
    getSubjectByAdminUserSpy = jest.spyOn(subjectGetter, 'getByAdminUser');
    getEdaeUserGetterSpy = jest.spyOn(edaeUserGetter, 'get');
    updateSpy = jest.spyOn(subjectRepository, 'save');

    handler = new RemoveEdaeUserFromSubjectHandler(
      subjectRepository,
      subjectGetter,
      edaeUserGetter,
    );
  });

  it('should remove an edae user from a subject', async () => {
    getSubjectByAdminUserSpy.mockImplementation((): Promise<Subject> => {
      return Promise.resolve(subject);
    });
    getEdaeUserGetterSpy.mockImplementation((): Promise<EdaeUser> => {
      return Promise.resolve(edaeUser);
    });

    await handler.handle(command);
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        _code: 'code',
        _name: 'name',
        _teachers: [],
      }),
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
