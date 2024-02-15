import { AdminUserRepository } from '#admin-user/domain/repository/admin-user.repository';
import { ImageUploader } from '#shared/domain/service/image-uploader.service';
import { AdminUserRolesChecker } from '#admin-user/domain/service/admin-user-roles-checker.service';
import { EditAdminUserCommand } from '#admin-user/application/edit-admin-user/edit-admin-user.command';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { getAnAdminUser } from '#test/entity-factory';
import { AdminUserMockRepository } from '#test/mocks/sga/adminUser/admin-user.mock-repository';
import {
  getAdminUserGetterMock,
  getAnAdminUserRolesCheckerMock,
  getImageUploaderMock,
} from '#test/service-factory';
import { EditAdminUserHandler } from '#admin-user/application/edit-admin-user/edit-admin-user.handler';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { AdminUserNotFoundException } from '#shared/domain/exception/admin-user/admin-user-not-found.exception';
import { IdentityDocumentType } from '#/sga/shared/domain/value-object/identity-document';
import { AdminUserNotAllowedRolesException } from '#shared/domain/exception/admin-user/admin-user-not-allowed-roles.exception';

let adminUserRepository: AdminUserRepository;
let adminUserGetter: AdminUserGetter;
let imageUploader: ImageUploader;
let adminUserRolesChecker: AdminUserRolesChecker;
let handler: EditAdminUserHandler;

let updateAdminUserSpy: any;
let getUserSpy: any;
let uploadImageSpy: any;

const user = getAnAdminUser();

const command = new EditAdminUserCommand(
  'adminUserId',
  'name',
  'apellidos1',
  'apellidos2',
  {
    identityDocumentType: IdentityDocumentType.DNI,
    identityDocumentNumber: '74700994F',
  },
  [AdminUserRoles.SUPERADMIN],
  user,
  'avatar',
);

describe('Edit adminUser handler', () => {
  beforeEach(() => {
    adminUserGetter = getAdminUserGetterMock();
    adminUserRepository = new AdminUserMockRepository();
    updateAdminUserSpy = jest.spyOn(adminUserRepository, 'save');
    imageUploader = getImageUploaderMock();
    uploadImageSpy = jest.spyOn(imageUploader, 'uploadImage');
    getUserSpy = jest.spyOn(adminUserGetter, 'getByAdminUser');
    adminUserRolesChecker = getAnAdminUserRolesCheckerMock();

    handler = new EditAdminUserHandler(
      adminUserRepository,
      adminUserGetter,
      adminUserRolesChecker,
      imageUploader,
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

  it('should edit an admin user', async () => {
    getUserSpy.mockImplementation((): Promise<any> => {
      return Promise.resolve(user);
    });

    jest
      .spyOn(adminUserRolesChecker, 'checkRoles')
      .mockImplementation(() => {});

    uploadImageSpy.mockImplementation((): Promise<string> => {
      return Promise.resolve('url');
    });

    await handler.handle(command);
    expect(updateAdminUserSpy).toHaveBeenCalledTimes(1);
    expect(updateAdminUserSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        _name: 'name',
        _surname: 'apellidos1',
        _surname2: 'apellidos2',
        _avatar: 'url',
      }),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
