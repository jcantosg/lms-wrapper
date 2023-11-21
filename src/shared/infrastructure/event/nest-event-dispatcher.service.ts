import { Injectable } from '@nestjs/common';
import { EventDispatcher } from '../../domain/event/event-dispatcher.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApplicationEvent } from '../../domain/event/application.event';

@Injectable()
export class NestEventDispatcher implements EventDispatcher {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async dispatch(event: ApplicationEvent): Promise<void> {
    await this.eventEmitter.emitAsync(event.name, event);
  }
}
