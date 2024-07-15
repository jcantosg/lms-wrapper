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
import { AddTeacherToInternalGroupHandler } from '#student/application/add-teacher-to-internal-group/add-teacher-to-internal-group.handler';
import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { InternalGroupGetter } from '#student/domain/service/internal-group.getter.service';
import { AddTeacherToInternalGroupCommand } from '#student/application/add-teacher-to-internal-group/add-teacher-to-internal-group.command';
import { InternalGroupMockRepository } from '#test/mocks/sga/student/internal-group.mock-repository';
import { InternalGroupNotFoundException } from '#shared/domain/exception/internal-group/internal-group.not-found.exception';
import { EventDispatcher } from '#shared/domain/event/event-dispatcher.service';
import { EventDispatcherMock } from '#test/mocks/shared/event-dispatcher.mock-service';

let handler: AddTeacherToInternalGroupHandler;
let repository: InternalGroupRepository;
let internalGroupGetter: InternalGroupGetter;
let edaeUserGetter: EdaeUserGetter;
let eventDispatcher: EventDispatcher;

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

const command = new AddTeacherToInternalGroupCommand(
  internalGroup.id,
  [edaeUser.id],
  getAnAdminUser(),
);

describe('Add Teacher to Internal Group Handler', () => {
  beforeAll(async () => {
    repository = new InternalGroupMockRepository();
    internalGroupGetter = getAInternalGroupGetterMock();
    edaeUserGetter = getEdaeUserGetterMock();
    eventDispatcher = new EventDispatcherMock();

    internalGroupGetByAdminUserSpy = jest.spyOn(
      internalGroupGetter,
      'getByAdminUser',
    );
    edaeUserGetByAdminUserSpy = jest.spyOn(edaeUserGetter, 'getByAdminUser');
    saveSpy = jest.spyOn(repository, 'save');

    handler = new AddTeacherToInternalGroupHandler(
      repository,
      internalGroupGetter,
      edaeUserGetter,
      eventDispatcher,
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

  it('should add a teacher to an internal group', async () => {
    internalGroupGetByAdminUserSpy.mockImplementation(() =>
      Promise.resolve(internalGroup),
    );
    edaeUserGetByAdminUserSpy.mockImplementation(() =>
      Promise.resolve(edaeUser),
    );

    edaeUser.addBusinessUnit(internalGroup.businessUnit);

    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: internalGroup.id,
        teachers: expect.arrayContaining([edaeUser]),
      }),
    );
  });
});
