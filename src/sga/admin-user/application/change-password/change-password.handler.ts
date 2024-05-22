import { CommandHandler } from '#shared/domain/bus/command.handler';
import { AdminUserRepository } from '#admin-user/domain/repository/admin-user.repository';
import { ChangePasswordCommand } from '#admin-user/application/change-password/change-password.command';
import { PasswordEncoder } from '#shared/domain/service/password-encoder.service';
import { PasswordFormatChecker } from '#admin-user/domain/service/password-format-checker.service';
import { PasswordChecker } from '#admin-user/domain/service/password-checker.service';
import { InvalidPasswordException } from '#shared/domain/exception/admin-user/invalid-password.exception';

export class ChangePasswordHandler implements CommandHandler {
  constructor(
    private readonly repository: AdminUserRepository,
    private readonly passwordEncoder: PasswordEncoder,
    private readonly passwordChecker: PasswordChecker,
    private readonly passwordFormatChecker: PasswordFormatChecker,
  ) {}

  async handle(command: ChangePasswordCommand): Promise<void> {
    if (
      !(await this.passwordChecker.checkPassword(
        command.currentPassword,
        command.user,
      ))
    ) {
      throw new InvalidPasswordException();
    }

    this.passwordFormatChecker.check(command.newPassword);

    const userToUpdate = command.user;
    userToUpdate.password = await this.passwordEncoder.encodePassword(
      command.newPassword,
    );
    userToUpdate.updatedAt = new Date();
    await this.repository.save(userToUpdate);
  }
}
