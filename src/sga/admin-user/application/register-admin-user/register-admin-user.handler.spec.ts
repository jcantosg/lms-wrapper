import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { RegisterAdminUserCommand } from '#admin-user/application/register-admin-user/register-admin-user.command';
import { RegisterAdminUserHandler } from '#admin-user/application/register-admin-user/register-admin-user.handler';
import { AdminUserRepository } from '#admin-user/domain/repository/admin-user.repository';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { AdminUserDuplicatedException } from '#shared/domain/exception/admin-user/admin-user-duplicated.exception';
import { ImageUploader } from '#shared/domain/service/image-uploader.service';
import { AdminUserMockRepository } from '#test/mocks/sga/adminUser/admin-user.mock-repository';
import {
  getAnAdminUserRolesCheckerMock,
  getBusinessUnitGetterMock,
  getImageUploaderMock,
  getPasswordGeneratorMock,
} from '#test/service-factory';
import { IdentityDocumentType } from '#/sga/shared/domain/value-object/identity-document';
import { EventDispatcher } from '#shared/domain/event/event-dispatcher.service';
import { EventDispatcherMock } from '#test/mocks/shared/event-dispatcher.mock-service';
import { AdminUserPasswordGenerator } from '#admin-user/domain/service/admin-user-password-generator.service';
import { getAnAdminUser } from '#test/entity-factory';
import { AdminUserRolesChecker } from '#admin-user/domain/service/admin-user-roles-checker.service';

let adminUserRepository: AdminUserRepository;
let passwordGenerator: AdminUserPasswordGenerator;
let businessUnitGetter: BusinessUnitGetter;
let imageUploader: ImageUploader;
let eventDispatcher: EventDispatcher;
let adminUserRolesChecker: AdminUserRolesChecker;
let handler: RegisterAdminUserHandler;

let saveAdminUserSpy: any;
let encodeSpy: any;
let uploadImageSpy: any;
let dispatchSpy: any;

const command = new RegisterAdminUserCommand(
  'adminUserId',
  'adminUsername@example.org',
  [AdminUserRoles.SUPERADMIN],
  'name',
  [],
  'surname',
  {
    identityDocumentType: IdentityDocumentType.DNI,
    identityDocumentNumber: '74700994F',
  },
  'surname2',
  getAnAdminUser(),
  'avatar',
);

describe('Register adminUser handler', () => {
  beforeEach(() => {
    adminUserRepository = new AdminUserMockRepository();
    saveAdminUserSpy = jest.spyOn(adminUserRepository, 'save');
    passwordGenerator = getPasswordGeneratorMock();
    encodeSpy = jest.spyOn(passwordGenerator, 'generatePassword');
    businessUnitGetter = getBusinessUnitGetterMock();
    imageUploader = getImageUploaderMock();
    uploadImageSpy = jest.spyOn(imageUploader, 'uploadImage');
    eventDispatcher = new EventDispatcherMock();
    dispatchSpy = jest.spyOn(eventDispatcher, 'dispatch');
    adminUserRolesChecker = getAnAdminUserRolesCheckerMock();

    handler = new RegisterAdminUserHandler(
      adminUserRepository,
      businessUnitGetter,
      imageUploader,
      eventDispatcher,
      passwordGenerator,
      adminUserRolesChecker,
    );
  });

  it('Should throw duplicated exception when id already exists', async () => {
    jest
      .spyOn(adminUserRepository, 'exists')
      .mockImplementation((): Promise<boolean> => {
        return Promise.resolve(true);
      });

    uploadImageSpy.mockImplementation((): Promise<string> => {
      return Promise.resolve('url');
    });

    await expect(handler.handle(command)).rejects.toThrow(
      AdminUserDuplicatedException,
    );

    expect(saveAdminUserSpy).toHaveBeenCalledTimes(0);
    expect(encodeSpy).toHaveBeenCalledTimes(0);
  });

  it('Should throw duplicated exception when email already exists', async () => {
    jest
      .spyOn(adminUserRepository, 'existsByEmail')
      .mockImplementation((): Promise<boolean> => {
        return Promise.resolve(true);
      });

    uploadImageSpy.mockImplementation((): Promise<string> => {
      return Promise.resolve('url');
    });

    await expect(handler.handle(command)).rejects.toThrow(
      AdminUserDuplicatedException,
    );

    expect(saveAdminUserSpy).toHaveBeenCalledTimes(0);
    expect(encodeSpy).toHaveBeenCalledTimes(0);
  });

  it('Should create a adminUser', async () => {
    jest
      .spyOn(adminUserRepository, 'exists')
      .mockImplementation((): Promise<boolean> => {
        return Promise.resolve(false);
      });

    uploadImageSpy.mockImplementation((): Promise<string> => {
      return Promise.resolve('url');
    });

    jest
      .spyOn(adminUserRepository, 'existsByEmail')
      .mockImplementation((): Promise<boolean> => {
        return Promise.resolve(false);
      });

    jest
      .spyOn(passwordGenerator, 'generatePassword')
      .mockImplementation((): string => {
        return 'password';
      });

    await handler.handle(command);
    expect(saveAdminUserSpy).toHaveBeenCalledTimes(1);
    expect(saveAdminUserSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'adminUserId',
      }),
    );
    expect(encodeSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'admin-user.created',
      }),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
