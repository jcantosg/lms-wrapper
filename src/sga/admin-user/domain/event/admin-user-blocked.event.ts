import { ApplicationEvent } from '#shared/domain/event/application.event';

export class AdminUserBlockedEvent implements ApplicationEvent {
  name: string = 'admin-user-blocked';

  constructor(
    readonly userId: string,
    readonly userEmail: string,
    readonly token: string,
  ) {}
}
