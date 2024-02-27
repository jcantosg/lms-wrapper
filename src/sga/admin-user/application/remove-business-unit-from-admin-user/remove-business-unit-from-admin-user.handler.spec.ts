import { AdminUserRepository } from '#admin-user/domain/repository/admin-user.repository';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { AdminUserRolesChecker } from '#admin-user/domain/service/admin-user-roles-checker.service';
import { getABusinessUnit, getAnAdminUser } from '#test/entity-factory';
import {
  getAdminUserGetterMock,
  getAnAdminUserRolesCheckerMock,
  getBusinessUnitGetterMock,
} from '#test/service-factory';
import { AdminUserMockRepository } from '#test/mocks/sga/adminUser/admin-user.mock-repository';
import { AdminUserNotFoundException } from '#shared/domain/exception/admin-user/admin-user-not-found.exception';
import { AdminUserNotAllowedRolesException } from '#shared/domain/exception/admin-user/admin-user-not-allowed-roles.exception';
import { RemoveBusinessUnitFromAdminUserHandler } from '#admin-user/application/remove-business-unit-from-admin-user/remove-business-unit-from-admin-user.handler';
import { RemoveBusinessUnitFromAdminUserCommand } from '#admin-user/application/remove-business-unit-from-admin-user/remove-business-unit-from-admin-user.command';

let adminUserRepository: AdminUserRepository;
let adminUserGetter: AdminUserGetter;
let businessUnitGetter: BusinessUnitGetter;
let adminUserRolesChecker: AdminUserRolesChecker;
let handler: RemoveBusinessUnitFromAdminUserHandler;

let updateAdminUserSpy: any;
let getByAdminUserSpy: any;

const user = getAnAdminUser();
const businessUnit = getABusinessUnit();

const command = new RemoveBusinessUnitFromAdminUserCommand(
  'adminUserId',
  'businessUnitId',
  user,
);

describe('Remove business unit from admin user handler', () => {
  beforeEach(() => {
    adminUserGetter = getAdminUserGetterMock();
    businessUnitGetter = getBusinessUnitGetterMock();
    adminUserRepository = new AdminUserMockRepository();
    updateAdminUserSpy = jest.spyOn(adminUserRepository, 'save');
    adminUserRolesChecker = getAnAdminUserRolesCheckerMock();
    getByAdminUserSpy = jest.spyOn(adminUserGetter, 'getByAdminUser');

    handler = new RemoveBusinessUnitFromAdminUserHandler(
      adminUserRepository,
      adminUserGetter,
      adminUserRolesChecker,
      businessUnitGetter,
    );
  });

  it('should throw a 404 not found user', async () => {
    jest
      .spyOn(adminUserGetter, 'getByAdminUser')
      .mockImplementation((): Promise<any> => {
        throw new AdminUserNotFoundException();
      });

    await expect(handler.handle(command)).rejects.toThrow(
      AdminUserNotFoundException,
    );
  });

  it('should throw a 403 forbidden rol', async () => {
    jest.spyOn(adminUserRolesChecker, 'checkRoles').mockImplementation(() => {
      throw new AdminUserNotAllowedRolesException();
    });
  });

  it('should throw a 404 not found business unit', async () => {
    jest.spyOn(businessUnitGetter, 'getByAdminUser').mockImplementation(() => {
      throw new AdminUserNotFoundException();
    });

    await expect(handler.handle(command)).rejects.toThrow(
      AdminUserNotFoundException,
    );
  });

  it('should remove business unit from admin user', async () => {
    getByAdminUserSpy.mockImplementation((): Promise<any> => {
      return Promise.resolve(user);
    });

    jest
      .spyOn(adminUserRolesChecker, 'checkRoles')
      .mockImplementation(() => {});

    jest
      .spyOn(businessUnitGetter, 'getByAdminUser')
      .mockImplementation(() => Promise.resolve(businessUnit));

    await handler.handle(command);
    expect(updateAdminUserSpy).toHaveBeenCalledTimes(1);
    expect(updateAdminUserSpy).toHaveBeenCalledWith(
      expect.objectContaining(user),
    );
  });
});
