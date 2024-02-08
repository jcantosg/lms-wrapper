import { ApplicationEvent } from '#shared/domain/event/application.event';

export class AdminUserCreatedEvent implements ApplicationEvent {
  name: string = 'admin-user.created';

  constructor(
    readonly userId: string,
    readonly userEmail: string,
    readonly password: string,
  ) {}
}
