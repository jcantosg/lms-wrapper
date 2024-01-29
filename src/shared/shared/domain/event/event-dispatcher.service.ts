import { ApplicationEvent } from '#shared/domain/event/application.event';

export abstract class EventDispatcher {
  abstract dispatch(event: ApplicationEvent): Promise<void>;
}
