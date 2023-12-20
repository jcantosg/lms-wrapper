import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { RegisterAdminUserCommand } from '#admin-user/application/register-admin-user/register-admin-user.command';
import { RegisterAdminUserHandler } from '#admin-user/application/register-admin-user/register-admin-user.handler';
import { AdminUserRepository } from '#admin-user/domain/repository/admin-user.repository';
import { PasswordEncoder } from '#admin-user/domain/service/password-encoder.service';
import { AdminUserDuplicatedException } from '#shared/domain/exception/admin-user/admin-user-duplicated.exception';
import { AdminUserMockRepository } from '#test/mocks/sga/adminUser/admin-user.mock-repository';
import { PasswordEncoderMock } from '#test/service-factory';

let adminUserRepository: AdminUserRepository;
let passwordEncoder: PasswordEncoder;
let handler: RegisterAdminUserHandler;

let saveAdminUserSpy: any;
let encodeSpy: any;

const command = new RegisterAdminUserCommand(
  'adminUserId',
  'adminUsername@example.org',
  'password',
  [AdminUserRoles.SUPERADMIN],
);

describe('Register adminUser handler', () => {
  beforeEach(() => {
    adminUserRepository = new AdminUserMockRepository();
    saveAdminUserSpy = jest.spyOn(adminUserRepository, 'save');
    passwordEncoder = new PasswordEncoderMock();
    encodeSpy = jest.spyOn(passwordEncoder, 'encodePassword');

    handler = new RegisterAdminUserHandler(
      adminUserRepository,
      passwordEncoder,
    );
  });

  it('Should throw duplicated exception when id already exists', async () => {
    jest
      .spyOn(adminUserRepository, 'exists')
      .mockImplementation((): Promise<boolean> => {
        return Promise.resolve(true);
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

    jest
      .spyOn(adminUserRepository, 'existsByEmail')
      .mockImplementation((): Promise<boolean> => {
        return Promise.resolve(false);
      });

    jest
      .spyOn(passwordEncoder, 'encodePassword')
      .mockImplementation((): Promise<string> => {
        return Promise.resolve('encodedPassword');
      });

    await handler.handle(command);
    expect(saveAdminUserSpy).toHaveBeenCalledTimes(1);
    expect(saveAdminUserSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'adminUserId',
      }),
    );
    expect(encodeSpy).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
