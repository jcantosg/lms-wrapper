import { AddEdaeUserToAdministrativeGroupHandler } from '#student/application/administrative-group/add-teacher-to-administrative-group/add-edae-user-to-administrative-group.handler';
import { AdministrativeGroupRepository } from '#student/domain/repository/administrative-group.repository';
import { AdministrativeGroupGetter } from '#student/domain/service/administrative-group.getter.service';
import { EdaeUserGetter } from '#edae-user/domain/service/edae-user-getter.service';
import { AddEdaeUserToAdministrativeGroupCommand } from '#student/application/administrative-group/add-teacher-to-administrative-group/add-edae-user-to-administrative-group.command';
import {
  getAnAdministrativeGroup,
  getAnAdminUser,
  getAnEdaeUser,
} from '#test/entity-factory';
import { AdministrativeGroupMockRepository } from '#test/mocks/sga/student/administrative-group.mock-repository';
import {
  getAnAdministrativeGroupGetterMock,
  getEdaeUserGetterMock,
} from '#test/service-factory';
import { EdaeUserNotFoundException } from '#shared/domain/exception/edae-user/edae-user-not-found.exception';

let handler: AddEdaeUserToAdministrativeGroupHandler;
let repository: AdministrativeGroupRepository;
let administrativeGroupGetter: AdministrativeGroupGetter;
let edaeUserGetter: EdaeUserGetter;

let adminGroupGetByAdminUserSpy: jest.SpyInstance;
let edaeUserGetByAdminUserSpy: jest.SpyInstance;
let saveSpy: jest.SpyInstance;

const administrativeGroup = getAnAdministrativeGroup();
const edaeUser = getAnEdaeUser();

const command = new AddEdaeUserToAdministrativeGroupCommand(
  administrativeGroup.id,
  [edaeUser.id],
  getAnAdminUser(),
);

describe('Add EdaeUser to Administrative Group Handler', () => {
  beforeAll(async () => {
    repository = new AdministrativeGroupMockRepository();
    administrativeGroupGetter = getAnAdministrativeGroupGetterMock();
    edaeUserGetter = getEdaeUserGetterMock();

    adminGroupGetByAdminUserSpy = jest.spyOn(
      administrativeGroupGetter,
      'getByAdminUser',
    );
    edaeUserGetByAdminUserSpy = jest.spyOn(edaeUserGetter, 'getByAdminUser');
    saveSpy = jest.spyOn(repository, 'save');

    handler = new AddEdaeUserToAdministrativeGroupHandler(
      repository,
      administrativeGroupGetter,
      edaeUserGetter,
    );
  });

  it('should throw an administrative group not found', async () => {
    adminGroupGetByAdminUserSpy.mockImplementation(() =>
      Promise.resolve(administrativeGroup),
    );
    edaeUserGetByAdminUserSpy.mockImplementation(() =>
      Promise.resolve(edaeUser),
    );

    await expect(handler.handle(command)).rejects.toThrow(
      EdaeUserNotFoundException,
    );
  });

  it('should add a teacher to an administrative group', async () => {
    adminGroupGetByAdminUserSpy.mockImplementation(() =>
      Promise.resolve(administrativeGroup),
    );
    edaeUserGetByAdminUserSpy.mockImplementation(() =>
      Promise.resolve(edaeUser),
    );

    edaeUser.addBusinessUnit(administrativeGroup.businessUnit);

    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: administrativeGroup.id,
        teachers: expect.arrayContaining([edaeUser]),
      }),
    );
  });
});
