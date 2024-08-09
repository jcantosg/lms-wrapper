import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { PasswordEncoder } from '#shared/domain/service/password-encoder.service';
import { EdaeUserGetter } from '#edae-user/domain/service/edae-user-getter.service';
import { EdaeUserCreatedEvent } from '#edae-user/domain/event/edae-user-created.event';
import { EdaeUserRepository } from '#edae-user/domain/repository/edae-user.repository';

@Injectable()
export class EdaeUserCreatedListener {
  constructor(
    private readonly mailer: MailerService,
    private passwordEncoder: PasswordEncoder,
    private repository: EdaeUserRepository,
    private edaeUserGetter: EdaeUserGetter,
  ) {}

  @OnEvent('edae-user.created')
  async handlerAdminUserCreatedEvent(payload: EdaeUserCreatedEvent) {
    const edaeUser = await this.edaeUserGetter.get(payload.userId);
    edaeUser.password = await this.passwordEncoder.encodePassword(
      payload.password,
    );
    await this.repository.save(edaeUser);

    this.mailer.sendMail({
      to: payload.userEmail,
      subject: 'Testing',
      text: `This is your password ${payload.password}`,
      html: `This is your password ${payload.password}`,
    });
  }
}
