import { RemoveEdaeUserFromAdministrativeGroupHandler } from '#student/application/administrative-group/remove-edae-user-from-administrative-group/remove-edae-user-from-administrative-group.handler';
import { AdministrativeGroupRepository } from '#student/domain/repository/administrative-group.repository';
import { AdministrativeGroupGetter } from '#student/domain/service/administrative-group.getter.service';
import { EdaeUserGetter } from '#edae-user/domain/service/edae-user-getter.service';
import {
  getAnAdministrativeGroup,
  getAnAdminUser,
  getAnEdaeUser,
} from '#test/entity-factory';
import { RemoveEdaeUserFromAdministrativeGroupCommand } from '#student/application/administrative-group/remove-edae-user-from-administrative-group/remove-edae-user-from-administrative-group.command';
import { AdministrativeGroupMockRepository } from '#test/mocks/sga/student/administrative-group.mock-repository';
import {
  getAnAdministrativeGroupGetterMock,
  getEdaeUserGetterMock,
} from '#test/service-factory';

let handler: RemoveEdaeUserFromAdministrativeGroupHandler;
let repository: AdministrativeGroupRepository;
let administrativeGroupGetter: AdministrativeGroupGetter;
let edaeUserGetter: EdaeUserGetter;

let adminGroupGetByAdminUserSpy: jest.SpyInstance;
let edaeUserGetSpy: jest.SpyInstance;
let saveSpy: jest.SpyInstance;

const administrativeGroup = getAnAdministrativeGroup();
const edaeUser = getAnEdaeUser();

const command = new RemoveEdaeUserFromAdministrativeGroupCommand(
  administrativeGroup.id,
  edaeUser.id,
  getAnAdminUser(),
);

describe('Remove EdaeUser from Administrative Group Handler', () => {
  beforeAll(async () => {
    repository = new AdministrativeGroupMockRepository();
    administrativeGroupGetter = getAnAdministrativeGroupGetterMock();
    edaeUserGetter = getEdaeUserGetterMock();

    adminGroupGetByAdminUserSpy = jest.spyOn(
      administrativeGroupGetter,
      'getByAdminUser',
    );
    edaeUserGetSpy = jest.spyOn(edaeUserGetter, 'get');
    saveSpy = jest.spyOn(repository, 'save');

    handler = new RemoveEdaeUserFromAdministrativeGroupHandler(
      repository,
      administrativeGroupGetter,
      edaeUserGetter,
    );
  });

  it('should remove an edae user from an administrative group', async () => {
    adminGroupGetByAdminUserSpy.mockImplementation(() =>
      Promise.resolve(administrativeGroup),
    );

    edaeUserGetSpy.mockImplementation(() => Promise.resolve(edaeUser));

    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: administrativeGroup.id,
        teachers: [],
      }),
    );
  });
});
