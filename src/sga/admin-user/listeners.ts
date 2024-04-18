import { AdminUserCreatedListener } from '#admin-user/infrastructure/listener/admin-user-created.listener';
import { RecoveryPasswordTokenGeneratedListener } from '#admin-user/infrastructure/listener/recovery-password-token-generated.listener';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { AdminUserBlockedListener } from '#admin-user/infrastructure/listener/admin-user-blocked.listener';

const recoveryPasswordTokenGeneratedListener = {
  provide: RecoveryPasswordTokenGeneratedListener,
  useFactory: (mailer: MailerService, configService: ConfigService) => {
    return new RecoveryPasswordTokenGeneratedListener(
      mailer,
      configService.get<string>('RECOVERY_TOKEN_URL')!,
    );
  },
  inject: [MailerService, ConfigService],
};

export const listeners = [
  AdminUserCreatedListener,
  recoveryPasswordTokenGeneratedListener,
  AdminUserBlockedListener,
];
