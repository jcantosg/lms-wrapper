import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApplicationEvent } from '#shared/domain/event/application.event';
import { EventDispatcher } from '#shared/domain/event/event-dispatcher.service';

@Injectable()
export class NestEventDispatcher implements EventDispatcher {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async dispatch(event: ApplicationEvent): Promise<void> {
    await this.eventEmitter.emitAsync(event.name, event);
  }
}
