import { Global, Module, Provider } from '@nestjs/common';
import { EventDispatcher } from './domain/event/event-dispatcher.service';
import { NestEventDispatcher } from './infrastructure/event/nest-event-dispatcher.service';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './infrastructure/controller/health.controller';
import { EventEmitterModule } from '@nestjs/event-emitter';

const providers: Provider[] = [
  {
    provide: EventDispatcher,
    useClass: NestEventDispatcher,
  },
];

@Global()
@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    TerminusModule,
    HttpModule,
  ],
  providers,
  controllers: [HealthController],
})
export class SharedModule {}
