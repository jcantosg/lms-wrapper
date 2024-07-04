import { EdaeUserGetter } from '#edae-user/domain/service/edae-user-getter.service';
import {
  getAnInternalGroup,
  getAnAdminUser,
  getAnEdaeUser,
  getAnAcademicPeriod,
  getAnAcademicProgram,
  getAPeriodBlock,
  getASubject,
} from '#test/entity-factory';
import {
  getAInternalGroupGetterMock,
  getEdaeUserGetterMock,
} from '#test/service-factory';
import { EdaeUserNotFoundException } from '#shared/domain/exception/edae-user/edae-user-not-found.exception';
import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { InternalGroupGetter } from '#student/domain/service/internal-group.getter.service';
import { InternalGroupMockRepository } from '#test/mocks/sga/student/internal-group.mock-repository';
import { InternalGroupNotFoundException } from '#shared/domain/exception/internal-group/internal-group.not-found.exception';
import { RemoveTeacherFromInternalGroupHandler } from '#student/application/remove-teacher-from-internal-group/remove-teacher-from-internal-group.handler';
import { RemoveTeacherFromInternalGroupCommand } from '#student/application/remove-teacher-from-internal-group/remove-teacher-from-internal-group.command';
import { CantRemoveDefaultTeacherException } from '#shared/domain/exception/internal-group/cant-remove-default-teacher.exception';

let handler: RemoveTeacherFromInternalGroupHandler;
let repository: InternalGroupRepository;
let internalGroupGetter: InternalGroupGetter;
let edaeUserGetter: EdaeUserGetter;

let internalGroupGetByAdminUserSpy: jest.SpyInstance;
let edaeUserGetByAdminUserSpy: jest.SpyInstance;
let saveSpy: jest.SpyInstance;

const internalGroup = getAnInternalGroup(
  getAnAcademicPeriod(),
  getAnAcademicProgram(),
  getAPeriodBlock(),
  getASubject(),
);
const edaeUser = getAnEdaeUser();

internalGroup.addTeachers([edaeUser]);

const command = new RemoveTeacherFromInternalGroupCommand(
  internalGroup.id,
  edaeUser.id,
  getAnAdminUser(),
);

describe('Remove Teacher from Internal Group Handler', () => {
  beforeAll(async () => {
    repository = new InternalGroupMockRepository();
    internalGroupGetter = getAInternalGroupGetterMock();
    edaeUserGetter = getEdaeUserGetterMock();

    internalGroupGetByAdminUserSpy = jest.spyOn(
      internalGroupGetter,
      'getByAdminUser',
    );
    edaeUserGetByAdminUserSpy = jest.spyOn(edaeUserGetter, 'getByAdminUser');
    saveSpy = jest.spyOn(repository, 'save');

    handler = new RemoveTeacherFromInternalGroupHandler(
      repository,
      internalGroupGetter,
      edaeUserGetter,
    );
  });

  it('should throw an internal group not found', async () => {
    internalGroupGetByAdminUserSpy.mockImplementation(() => {
      throw new InternalGroupNotFoundException();
    });

    await expect(handler.handle(command)).rejects.toThrow(
      InternalGroupNotFoundException,
    );
  });

  it('should throw an edae user not found', async () => {
    internalGroupGetByAdminUserSpy.mockImplementation(() =>
      Promise.resolve(internalGroup),
    );
    edaeUserGetByAdminUserSpy.mockImplementation(() =>
      Promise.resolve(edaeUser),
    );

    await expect(handler.handle(command)).rejects.toThrow(
      EdaeUserNotFoundException,
    );
  });

  it('should throw a cant remove default teacher exception', async () => {
    internalGroupGetByAdminUserSpy.mockImplementation(() =>
      Promise.resolve(internalGroup),
    );
    edaeUserGetByAdminUserSpy.mockImplementation(() =>
      Promise.resolve(edaeUser),
    );

    edaeUser.addBusinessUnit(internalGroup.businessUnit);
    internalGroup.defaultTeacher = edaeUser;

    await expect(handler.handle(command)).rejects.toThrow(
      CantRemoveDefaultTeacherException,
    );
  });

  it('should remove a teacher from an internal group', async () => {
    internalGroupGetByAdminUserSpy.mockImplementation(() =>
      Promise.resolve(internalGroup),
    );
    edaeUserGetByAdminUserSpy.mockImplementation(() =>
      Promise.resolve(edaeUser),
    );

    edaeUser.addBusinessUnit(internalGroup.businessUnit);
    internalGroup.defaultTeacher = null;

    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: internalGroup.id,
        teachers: [],
      }),
    );
  });
});
