import { ApplicationEvent } from './application.event';

export abstract class EventDispatcher {
  abstract dispatch(event: ApplicationEvent): void;
}
