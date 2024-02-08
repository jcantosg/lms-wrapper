import { OnEvent } from '@nestjs/event-emitter';
import { AdminUserCreatedEvent } from '#admin-user/domain/event/admin-user-created.event';
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { AdminUserRepository } from '#admin-user/domain/repository/admin-user.repository';
import { PasswordEncoder } from '#admin-user/domain/service/password-encoder.service';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';

@Injectable()
export class AdminUserCreatedListener {
  constructor(
    private readonly mailer: MailerService,
    private passwordEncoder: PasswordEncoder,
    private repository: AdminUserRepository,
    private adminUserGetter: AdminUserGetter,
  ) {}

  @OnEvent('admin-user.created')
  async handlerAdminUserCreatedEvent(payload: AdminUserCreatedEvent) {
    const adminUser = await this.adminUserGetter.get(payload.userId);
    adminUser.password = await this.passwordEncoder.encodePassword(
      payload.password,
    );
    await this.repository.save(adminUser);
    this.mailer.sendMail({
      to: payload.userEmail,
      subject: 'Testing',
      text: `This is your password ${payload.password}`,
      html: `This is your password ${payload.password}`,
    });
  }
}
