import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { studentSchemas } from '#student/schemas';
import { repositories } from '#student/repositories';
import { handlers } from '#student/handlers';
import { controllers } from '#student/controllers';
import { services } from '#student/services';
import { BusinessUnitModule } from '#business-unit/business-unit.module';
import { AcademicOfferingModule } from '#academic-offering/academic-offering.module';

@Module({
  imports: [
    TypeOrmModule.forFeature(studentSchemas),
    BusinessUnitModule,
    AcademicOfferingModule,
  ],
  providers: [...repositories, ...handlers, ...services],
  exports: [...repositories, ...services],
  controllers: [...controllers],
})
export class StudentModule {}
