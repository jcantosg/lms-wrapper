import { v4 as uuid } from 'uuid';
import {
  getABusinessUnit,
  getAnAdminUser,
  getAnEdaeUser,
  getASubject,
} from '#test/entity-factory';
import { AddEdaeUsersToSubjectHandler } from '#academic-offering/applicaton/subject/add-edae-users-to-subject/add-edae-users-to-subject.handler';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { SubjectGetter } from '#academic-offering/domain/service/subject/subject-getter.service';
import { EdaeUserGetter } from '#edae-user/domain/service/edae-user-getter.service';
import { EdaeUserBusinessUnitChecker } from '#edae-user/domain/service/edae-user-business-unitChecker.service';
import { AddEdaeUsersToSubjectCommand } from '#academic-offering/applicaton/subject/add-edae-users-to-subject/add-edae-users-to-subject.command';
import { SubjectMockRepository } from '#test/mocks/sga/academic-offering/subject.mock-repository';
import {
  getASubjectGetterMock,
  getEdaeUserBusinessUnitCheckerMock,
  getEdaeUserGetterMock,
} from '#test/service-factory';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { EdaeUserNotFoundException } from '#shared/domain/exception/edae-user/edae-user-not-found.exception';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';

let handler: AddEdaeUsersToSubjectHandler;
let subjectRepository: SubjectRepository;
let subjectGetter: SubjectGetter;
let edaeUserGetter: EdaeUserGetter;
let edaeUserBusinessUnitChecker: EdaeUserBusinessUnitChecker;

let getSubjectByAdminUserSpy: any;
let getEdaeUserGetterSpy: any;
let updateSpy: any;

const subject = getASubject();
const edaeUser = getAnEdaeUser();
const user = getAnAdminUser();
const businessUnit = getABusinessUnit();
user.addBusinessUnit(businessUnit);

const command = new AddEdaeUsersToSubjectCommand(uuid(), [edaeUser.id], user);

describe('Add Edae Users to Subject', () => {
  beforeAll(() => {
    subjectRepository = new SubjectMockRepository();
    subjectGetter = getASubjectGetterMock();
    edaeUserGetter = getEdaeUserGetterMock();
    edaeUserBusinessUnitChecker = getEdaeUserBusinessUnitCheckerMock();

    getSubjectByAdminUserSpy = jest.spyOn(subjectGetter, 'getByAdminUser');
    getEdaeUserGetterSpy = jest.spyOn(edaeUserGetter, 'getByAdminUser');

    updateSpy = jest.spyOn(subjectRepository, 'save');

    handler = new AddEdaeUsersToSubjectHandler(
      subjectRepository,
      subjectGetter,
      edaeUserGetter,
      edaeUserBusinessUnitChecker,
    );
  });

  it('Should throw a EdaeUserNotFoundException', async () => {
    getSubjectByAdminUserSpy.mockImplementation((): Promise<Subject> => {
      return Promise.resolve(subject);
    });

    getEdaeUserGetterSpy.mockImplementation((): Promise<EdaeUser> => {
      return Promise.resolve(edaeUser);
    });

    await expect(handler.handle(command)).rejects.toThrow(
      EdaeUserNotFoundException,
    );
  });

  it('should add teacher to subject', async () => {
    getSubjectByAdminUserSpy.mockImplementation((): Promise<Subject> => {
      return Promise.resolve(subject);
    });

    getEdaeUserGetterSpy.mockImplementation((): Promise<EdaeUser> => {
      return Promise.resolve(edaeUser);
    });

    edaeUser.addBusinessUnit(businessUnit);
    subject.businessUnit = businessUnit;

    await handler.handle(command);
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        _code: 'code',
        _name: 'name',
        _teachers: expect.arrayContaining([edaeUser]),
      }),
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
