import { v4 as uuid } from 'uuid';
import { EditVirtualCampusHandler } from '#business-unit/application/edit-virtual-campus/edit-virtual-campus.handler';
import { VirtualCampusRepository } from '#business-unit/domain/repository/virtual-campus.repository';
import { EditVirtualCampusCommand } from '#business-unit/application/edit-virtual-campus/edit-virtual-campus.command';
import { getAVirtualCampus, getAnAdminUser } from '#test/entity-factory';
import {
  getVirtualCampusGetterMock,
  getAdminUserGetterMock,
} from '#test/service-factory';
import { VirtualCampusMockRepository } from '#test/mocks/sga/business-unit/virtual-campus.mock-repository';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { VirtualCampusGetter } from '#business-unit/domain/service/virtual-campus-getter.service';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { VirtualCampus } from '#business-unit/domain/entity/virtual-campus.entity';

let handler: EditVirtualCampusHandler;
let virtualCampusRepository: VirtualCampusRepository;
let adminUserGetter: AdminUserGetter;
let virtualCampusGetter: VirtualCampusGetter;

let getUserSpy: any;
let updateSpy: any;
let getVirtualCampusSpy: any;

const command = new EditVirtualCampusCommand(
  uuid(),
  'name',
  'code',
  uuid(),
  true,
);

const user = getAnAdminUser();
const virtualCampus = getAVirtualCampus(command.id);

describe('Edit Virtual Campus Handler', () => {
  beforeAll(() => {
    adminUserGetter = getAdminUserGetterMock();
    virtualCampusRepository = new VirtualCampusMockRepository();
    virtualCampusGetter = getVirtualCampusGetterMock();

    getUserSpy = jest.spyOn(adminUserGetter, 'get');
    getVirtualCampusSpy = jest.spyOn(virtualCampusGetter, 'get');
    updateSpy = jest.spyOn(virtualCampusRepository, 'update');
    handler = new EditVirtualCampusHandler(
      virtualCampusRepository,
      virtualCampusGetter,
      adminUserGetter,
    );
  });

  it('should edit a virtual campus', async () => {
    getUserSpy.mockImplementation((): Promise<AdminUser | null> => {
      return Promise.resolve(user);
    });

    getVirtualCampusSpy.mockImplementation(
      (): Promise<VirtualCampus | null> => {
        return Promise.resolve(virtualCampus);
      },
    );
    await handler.handle(command);

    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        _code: 'code',
        _name: 'name',
      }),
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
