import { Global, Module, Provider } from '@nestjs/common';
import { EventDispatcher } from './domain/event/event-dispatcher.service';
import { NestEventDispatcher } from './infrastructure/event/nest-event-dispatcher.service';

const providers: Provider[] = [
  {
    provide: EventDispatcher,
    useClass: NestEventDispatcher,
  },
];

@Global()
@Module({
  providers,
  exports: [...providers],
})
export class SharedModule {}
