import { ApplicationEvent } from '#shared/domain/event/application.event';

export class RecoveryPasswordTokenGeneratedEvent implements ApplicationEvent {
  name = 'student.recovery-password-token.generated';

  constructor(
    readonly userName: string,
    readonly userEmail: string,
    readonly userToken: string,
  ) {}
}
