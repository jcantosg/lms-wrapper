import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { RecoveryPasswordTokenGeneratedEvent } from '#admin-user/domain/event/recovery-password-token-generated.event';

@Injectable()
export class RecoveryPasswordTokenGeneratedListener {
  constructor(
    private readonly mailer: MailerService,
    private readonly url: string,
  ) {}

  @OnEvent('recovery-token-password.generated')
  async handlerRecoveryPasswordTokenGeneratedEvent(
    event: RecoveryPasswordTokenGeneratedEvent,
  ) {
    this.mailer.sendMail({
      to: event.userEmail,
      template: './recovery-token-password',
      subject: 'Recuperar contraseña',
      context: {
        url: `${this.url}/${event.token}`,
        name: event.userName,
      },
    });
  }
}
