import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { repositories } from '#business-unit/repositories';
import { businessUnitSchemas } from '#business-unit/schemas';
import { AdminUserModule } from '#admin-user/admin-user.module';
import { handlers } from '#business-unit/handlers';
import { services } from '#business-unit/services';
import { controllers } from '#business-unit/controllers';
import { listeners } from '#business-unit/listeners';
import { EventDispatcher } from '#shared/domain/event/event-dispatcher.service';
import { NestEventDispatcher } from '#shared/infrastructure/event/nest-event-dispatcher.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(businessUnitSchemas),
    forwardRef(() => AdminUserModule),
  ],
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
  controllers: [...controllers],
  exports: [...services],
})
export class BusinessUnitModule {}
