import { SetDefaultTeacherToSubjectHandler } from '#academic-offering/applicaton/subject/set-default-teacher-to-subject/set-default-teacher-to-subject.handler';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { EdaeUserGetter } from '#edae-user/domain/service/edae-user-getter.service';
import {
  getAnAdminUser,
  getAnEdaeUser,
  getASubject,
} from '#test/entity-factory';
import { SetDefaultTeacherToSubjectCommand } from '#academic-offering/applicaton/subject/set-default-teacher-to-subject/set-default-teacher-to-subject.command';
import { SubjectMockRepository } from '#test/mocks/sga/academic-offering/subject.mock-repository';
import {
  getASubjectGetterMock,
  getEdaeUserGetterMock,
} from '#test/service-factory';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';
import { SubjectInvalidDefaultTeacherException } from '#shared/domain/exception/academic-offering/subject.invalid-default-teacher.exception';

let handler: SetDefaultTeacherToSubjectHandler;
let subjectRepository: SubjectRepository;
let subjectGetter: SubjectGetter;
let edaeUserGetter: EdaeUserGetter;

let getSubjectByAdminUserSpy: jest.SpyInstance;
let getEdaeUserGetterSpy: jest.SpyInstance;
let updateSpy: jest.SpyInstance;

const subject = getASubject();
const edaeUser = getAnEdaeUser();
const user = getAnAdminUser();

const command = new SetDefaultTeacherToSubjectCommand(
  subject.id,
  edaeUser.id,
  user,
);

describe('Set Default Teacher to Subject', () => {
  beforeAll(() => {
    subjectRepository = new SubjectMockRepository();
    subjectGetter = getASubjectGetterMock();
    edaeUserGetter = getEdaeUserGetterMock();

    getSubjectByAdminUserSpy = jest.spyOn(subjectGetter, 'getByAdminUser');
    getEdaeUserGetterSpy = jest.spyOn(edaeUserGetter, 'get');
    updateSpy = jest.spyOn(subjectRepository, 'save');

    handler = new SetDefaultTeacherToSubjectHandler(
      subjectRepository,
      subjectGetter,
      edaeUserGetter,
    );
  });

  it('should throw an invalid default teacher error', async () => {
    getSubjectByAdminUserSpy.mockImplementation((): Promise<Subject> => {
      return Promise.resolve(subject);
    });
    getEdaeUserGetterSpy.mockImplementation((): Promise<EdaeUser> => {
      return Promise.resolve(edaeUser);
    });

    await expect(handler.handle(command)).rejects.toThrow(
      SubjectInvalidDefaultTeacherException,
    );
  });

  it('should set default teacher', async () => {
    getSubjectByAdminUserSpy.mockImplementation((): Promise<Subject> => {
      return Promise.resolve(subject);
    });
    getEdaeUserGetterSpy.mockImplementation((): Promise<EdaeUser> => {
      return Promise.resolve(edaeUser);
    });
    subject.teachers = [edaeUser];

    await handler.handle(command);
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy).toHaveBeenCalledWith(subject);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
