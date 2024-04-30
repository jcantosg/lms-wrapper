import { ApplicationEvent } from '#shared/domain/event/application.event';

export class RecoveryPasswordTokenGeneratedEvent implements ApplicationEvent {
  name: string = 'recovery-token-password.generated';

  constructor(
    readonly userEmail: string,
    readonly userName: string,
    readonly token: string,
  ) {}
}
