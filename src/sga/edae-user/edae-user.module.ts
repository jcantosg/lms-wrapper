import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { edaeUserSchema } from '#edae-user/infrastructure/config/schema/edae-user.schema';
import { repositories } from '#edae-user/repositories';
import { services } from '#edae-user/services';
import { BusinessUnitModule } from '#business-unit/business-unit.module';
import { controllers } from '#edae-user/controllers';
import { handlers } from '#edae-user//handlers';

@Module({
  imports: [TypeOrmModule.forFeature([edaeUserSchema]), BusinessUnitModule],
  controllers: [...controllers],
  providers: [...repositories, ...handlers, ...services],
  exports: [...services],
})
export class EdaeUserModule {}
