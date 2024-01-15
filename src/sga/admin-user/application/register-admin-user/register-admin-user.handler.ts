import { RegisterAdminUserCommand } from '#admin-user/application/register-admin-user/register-admin-user.command';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdminUserRepository } from '#admin-user/domain/repository/admin-user.repository';
import { PasswordEncoder } from '#admin-user/domain/service/password-encoder.service';
import { CommandHandler } from '#shared/domain/bus/command.handler';
import { AdminUserDuplicatedException } from '#shared/domain/exception/admin-user/admin-user-duplicated.exception';

export class RegisterAdminUserHandler implements CommandHandler {
  constructor(
    private readonly adminUserRepository: AdminUserRepository,
    private readonly passwordEncoder: PasswordEncoder,
    private readonly defaultAvatar: string,
  ) {}

  async handle(command: RegisterAdminUserCommand): Promise<void> {
    if (
      (await this.adminUserRepository.exists(command.id)) ||
      (await this.adminUserRepository.existsByEmail(command.email))
    ) {
      throw new AdminUserDuplicatedException();
    }

    const adminUser: AdminUser = AdminUser.create(
      command.id,
      command.email,
      await this.passwordEncoder.encodePassword(command.password),
      command.roles,
      command.name,
      command.avatar ?? this.defaultAvatar,
    );
    await this.adminUserRepository.save(adminUser);
  }
}
