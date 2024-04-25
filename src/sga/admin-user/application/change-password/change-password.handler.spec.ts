import { AdminUserRepository } from '#admin-user/domain/repository/admin-user.repository';
import { getAnAdminUser } from '#test/entity-factory';
import { AdminUserMockRepository } from '#test/mocks/sga/adminUser/admin-user.mock-repository';
import clearAllMocks = jest.clearAllMocks;
import { ChangePasswordHandler } from '#admin-user/application/change-password/change-password.handler';
import { PasswordEncoder } from '#admin-user/domain/service/password-encoder.service';
import { PasswordFormatChecker } from '#admin-user/domain/service/password-format-checker.service';
import { ChangePasswordCommand } from '#admin-user/application/change-password/change-password.command';
import { PasswordChecker } from '#admin-user/domain/service/password-checker.service';
import { InvalidPasswordException } from '#shared/domain/exception/admin-user/invalid-password.exception';
import {
  PasswordCheckerMock,
  PasswordEncoderMock,
  PasswordFormatCheckerMock,
} from '#test/service-factory';
import { InvalidFormatPasswordException } from '#shared/domain/exception/admin-user/invalid-format-password.exception';

let handler: ChangePasswordHandler;
let repository: AdminUserRepository;
let passwordEncoder: PasswordEncoder;
let passwordChecker: PasswordChecker;
let passwordFormatChecker: PasswordFormatChecker;

let saveSpy: jest.SpyInstance;

const adminUser = getAnAdminUser();

const invalidCurrentCommand = new ChangePasswordCommand(
  adminUser,
  'invalid',
  'newpa',
);
const invalidNewCommand = new ChangePasswordCommand(
  adminUser,
  'password',
  'newpa',
);
const command = new ChangePasswordCommand(
  adminUser,
  'password',
  'newPassword&123',
);

describe('Change Password Handler Test', () => {
  beforeAll(async () => {
    repository = new AdminUserMockRepository();
    passwordEncoder = new PasswordEncoderMock();
    passwordChecker = new PasswordCheckerMock();
    passwordFormatChecker = new PasswordFormatCheckerMock();
    handler = new ChangePasswordHandler(
      repository,
      passwordEncoder,
      passwordChecker,
      passwordFormatChecker,
    );

    saveSpy = jest.spyOn(repository, 'save');
  });
  it('should throw invalid current password', async () => {
    jest
      .spyOn(passwordChecker, 'checkPassword')
      .mockImplementation((): Promise<boolean> => {
        return Promise.resolve(false);
      });

    await expect(handler.handle(invalidCurrentCommand)).rejects.toThrow(
      InvalidPasswordException,
    );
  });

  it('should throw invalid new password', async () => {
    jest
      .spyOn(passwordChecker, 'checkPassword')
      .mockImplementation((): Promise<boolean> => {
        return Promise.resolve(true);
      });
    jest
      .spyOn(passwordFormatChecker, 'check')
      .mockImplementation((): Promise<void> => {
        throw new InvalidFormatPasswordException();
      });

    await expect(handler.handle(invalidNewCommand)).rejects.toThrow(
      InvalidFormatPasswordException,
    );
  });

  it('should change password', async () => {
    jest
      .spyOn(passwordChecker, 'checkPassword')
      .mockImplementation((): Promise<boolean> => {
        return Promise.resolve(true);
      });
    jest
      .spyOn(passwordFormatChecker, 'check')
      .mockImplementation((): Promise<void> => {
        return Promise.resolve();
      });
    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(1);
  });

  afterAll(() => {
    clearAllMocks();
  });
});
