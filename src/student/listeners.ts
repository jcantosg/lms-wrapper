import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { StudentRecoveryPasswordTokenGeneratedListener } from '#/student/student/infrastructure/listener/student-recovery-password-token-generated-listener.service';

const recoveryPasswordTokenGeneratedListener = {
  provide: StudentRecoveryPasswordTokenGeneratedListener,
  useFactory: (mailer: MailerService, configService: ConfigService) => {
    return new StudentRecoveryPasswordTokenGeneratedListener(
      mailer,
      configService.get<string>('RECOVERY_TOKEN_URL')!,
    );
  },
  inject: [MailerService, ConfigService],
};

export const listeners = [recoveryPasswordTokenGeneratedListener];
