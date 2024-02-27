import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { edaeUserSchema } from '#edae-user/infrastructure/config/schema/edae-user.schema';
import { repositories } from '#edae-user/repositories';
import { handlers } from '#edae-user/handlers';
import { controllers } from '#edae-user/controllers';
import { BusinessUnitModule } from '#business-unit/business-unit.module';

@Module({
  imports: [TypeOrmModule.forFeature([edaeUserSchema]), BusinessUnitModule],
  controllers: [...controllers],
  providers: [...repositories, ...handlers],
  exports: [],
})
export class EdaeUserModule {}
