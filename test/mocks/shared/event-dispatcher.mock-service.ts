import { EventDispatcher } from '#shared/domain/event/event-dispatcher.service';

export class EventDispatcherMock extends EventDispatcher {
  dispatch = jest.fn();
}
