import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { OnEvent } from '@nestjs/event-emitter';
import { RecoveryPasswordTokenGeneratedEvent } from '#/student-360/student/domain/event/recovery-password-token-generated.event';

@Injectable()
export class StudentRecoveryPasswordTokenGeneratedListener {
  constructor(
    private readonly mailer: MailerService,
    private readonly url: string,
  ) {}

  @OnEvent('student.recovery-password-token.generated')
  async handlerRecoveryPasswordTokenGeneratedEvent(
    event: RecoveryPasswordTokenGeneratedEvent,
  ) {
    this.mailer.sendMail({
      to: event.userEmail,
      template: './student-recovery-token-password',
      subject: 'Recuperar contraseña',
      context: {
        url: `${this.url}?token=${event.userToken}`,
        name: event.userName,
      },
    });
  }
}
