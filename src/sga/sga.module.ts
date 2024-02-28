import { AdminUserModule } from '#admin-user/admin-user.module';
import { BusinessUnitModule } from '#business-unit/business-unit.module';
import { Module } from '@nestjs/common';
import { EdaeUserModule } from '#edae-user/edae-user.module';
import { AcademicOfferingModule } from '#academic-offering/academic-offering.module';

@Module({
  imports: [
    BusinessUnitModule,
    AdminUserModule,
    EdaeUserModule,
    AcademicOfferingModule,
  ],
})
export class SGAModule {}
