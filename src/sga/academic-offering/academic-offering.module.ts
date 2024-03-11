import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { academicPeriodSchemas } from '#academic-offering/schemas';
import { repositories } from '#academic-offering/repositories';
import { handlers } from '#academic-offering/handlers';
import { BusinessUnitModule } from '#business-unit/business-unit.module';
import { controllers } from '#academic-offering/controllers';
import { services } from '#academic-offering/services';

@Module({
  imports: [
    TypeOrmModule.forFeature(academicPeriodSchemas),
    BusinessUnitModule,
  ],
  providers: [...repositories, ...handlers, ...services],
  controllers: [...controllers],
  exports: [...services],
})
export class AcademicOfferingModule {}
