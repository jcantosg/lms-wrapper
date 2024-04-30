import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { AdminUserBlockedEvent } from '#admin-user/domain/event/admin-user-blocked.event';
import { OnEvent } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminUserBlockedListener {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  @OnEvent('admin-user-blocked')
  async handleEvent(event: AdminUserBlockedEvent) {
    const url = `${this.configService.getOrThrow('APP_URL')}/new-password/${
      event.token
    }`;
    this.mailerService.sendMail({
      to: event.userEmail,
      template: './admin-blocked',
      subject: 'Account Blocked',
      context: {
        urlApp: url,
      },
    });
  }
}
