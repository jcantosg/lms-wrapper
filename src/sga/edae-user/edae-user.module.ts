import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { edaeUserSchema } from '#edae-user/infrastructure/config/schema/edae-user.schema';
import { repositories } from '#edae-user/repositories';
import { services } from '#edae-user/services';
import { BusinessUnitModule } from '#business-unit/business-unit.module';
import { controllers } from '#edae-user/controllers';
import { handlers } from '#edae-user//handlers';
import { listeners } from '#edae-user/listeners';
import { SharedModule } from '#shared/shared.module';
import { EventDispatcher } from '#shared/domain/event/event-dispatcher.service';
import { NestEventDispatcher } from '#shared/infrastructure/event/nest-event-dispatcher.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([edaeUserSchema]),
    BusinessUnitModule,
    SharedModule,
  ],
  controllers: [...controllers],
  providers: [
    ...repositories,
    ...handlers,
    ...services,
    ...listeners,
    {
      provide: EventDispatcher,
      useClass: NestEventDispatcher,
    },
  ],
  exports: [...services, ...repositories],
})
export class EdaeUserModule {}
