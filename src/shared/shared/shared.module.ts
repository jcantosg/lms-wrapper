import { Global, Module, Provider } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { repositories } from '#shared/repositories';
import { sharedSchemas } from '#shared/schemas';
import { EventDispatcher } from '#shared/domain/event/event-dispatcher.service';
import { NestEventDispatcher } from '#shared/infrastructure/event/nest-event-dispatcher.service';
import { HealthController } from '#shared/infrastructure/controller/health.controller';
import { services } from '#shared/services';
import { handlers } from '#shared/handlers';
import { GetCountryController } from '#shared/infrastructure/controller/country/get-countries.controller';

const providers: Provider[] = [
  {
    provide: EventDispatcher,
    useClass: NestEventDispatcher,
  },
  ...repositories,
  ...services,
  ...handlers,
];

@Global()
@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    TerminusModule,
    HttpModule,
    TypeOrmModule.forFeature(sharedSchemas),
  ],
  providers,
  controllers: [HealthController, GetCountryController],
  exports: [...repositories, ...services],
})
export class SharedModule {}
