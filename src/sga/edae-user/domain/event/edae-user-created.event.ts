import { ApplicationEvent } from '#shared/domain/event/application.event';

export class EdaeUserCreatedEvent implements ApplicationEvent {
  name: string = 'edae-user.created';

  constructor(
    readonly userId: string,
    readonly userEmail: string,
    readonly password: string,
  ) {}
}
