import { ApplicationEvent } from '#shared/domain/event/application.event';

export class BusinessUnitCreatedEvent implements ApplicationEvent {
  readonly name = 'business-unit.created';

  constructor(readonly businessUnitId: string) {}
}
