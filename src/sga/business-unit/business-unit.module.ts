import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { repositories } from '#business-unit/repositories';
import { businessUnitSchemas } from '#business-unit/schemas';
import { AdminUserModule } from '#admin-user/admin-user.module';
import { handlers } from '#business-unit/handlers';
import { services } from '#business-unit/services';
import { controllers } from '#business-unit/controllers';

@Module({
  imports: [TypeOrmModule.forFeature(businessUnitSchemas), AdminUserModule],
  providers: [...repositories, ...handlers, ...services],
  controllers: [...controllers],
})
export class BusinessUnitModule {}
