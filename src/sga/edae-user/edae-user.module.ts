import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { edaeUserSchema } from './infrastructure/config/schema/edae-user.schema';
import { handlers } from './handlers';
import { repositories } from '#edae-user/repositories';
import { services } from '#edae-user/services';
import { BusinessUnitModule } from '#business-unit/business-unit.module';
import { controllers } from '#edae-user/controllers';

@Module({
  imports: [TypeOrmModule.forFeature([edaeUserSchema]), BusinessUnitModule],
  controllers: [...controllers],
  providers: [...repositories, ...handlers, ...services],
  exports: [],
})
export class EdaeUserModule {}
