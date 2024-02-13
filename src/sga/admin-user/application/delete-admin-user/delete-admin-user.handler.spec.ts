import { AdminUserRepository } from '#admin-user/domain/repository/admin-user.repository';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { AdminUserRolesChecker } from '#admin-user/domain/service/admin-user-roles-checker.service';
import { getAnAdminUser } from '#test/entity-factory';
import { AdminUserMockRepository } from '#test/mocks/sga/adminUser/admin-user.mock-repository';
import {
  getAdminUserGetterMock,
  getAnAdminUserBusinessUnitsCheckerMock,
  getAnAdminUserRolesCheckerMock,
} from '#test/service-factory';
import { DeleteAdminUserCommand } from '#admin-user/application/delete-admin-user/delete-admin-user.command';
import { v4 as uuid } from 'uuid';
import { DeleteAdminUserHandler } from '#admin-user/application/delete-admin-user/delete-admin-user.handler';
import {
  AdminUser,
  AdminUserStatus,
} from '#admin-user/domain/entity/admin-user.entity';
import { AdminUserNotFoundException } from '#shared/domain/exception/admin-user/admin-user-not-found.exception';
import { AdminUserBusinessUnitsChecker } from '#admin-user/domain/service/admin-user-business-units.checker.service';

let adminUserRepository: AdminUserRepository;
let adminUserGetter: AdminUserGetter;
let adminUserRolesChecker: AdminUserRolesChecker;
let adminUserBusinessUnitsChecker: AdminUserBusinessUnitsChecker;
let getUserSpy: any;
let saveSpy: any;

const adminUser = getAnAdminUser();

const command = new DeleteAdminUserCommand(uuid(), adminUser);
let handler: DeleteAdminUserHandler;

describe('delete admin user handler', () => {
  beforeAll(() => {
    adminUserRepository = new AdminUserMockRepository();
    adminUserGetter = getAdminUserGetterMock();
    adminUserRolesChecker = getAnAdminUserRolesCheckerMock();
    adminUserBusinessUnitsChecker = getAnAdminUserBusinessUnitsCheckerMock();
    getUserSpy = jest.spyOn(adminUserGetter, 'get');
    saveSpy = jest.spyOn(adminUserRepository, 'save');

    handler = new DeleteAdminUserHandler(
      adminUserRepository,
      adminUserGetter,
      adminUserRolesChecker,
      adminUserBusinessUnitsChecker,
    );
  });
  it('should delete an admin user', async () => {
    getUserSpy.mockImplementation((): Promise<AdminUser> => {
      return Promise.resolve(adminUser);
    });
    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: adminUser.id,
        _name: 'deleted',
        _status: AdminUserStatus.DELETED,
      }),
    );
  });
  it('should throw an AdminUserNotFoundException', async () => {
    getUserSpy.mockImplementation((): Promise<AdminUser> => {
      throw new AdminUserNotFoundException();
    });
    await expect(async () => {
      await handler.handle(command);
    }).rejects.toThrow(AdminUserNotFoundException);
  });
});
