import { AdminUserModule } from '#admin-user/admin-user.module';
import { BusinessUnitModule } from '#business-unit/business-unit.module';
import { Module } from '@nestjs/common';
import { AcademicOfferingModule } from '#academic-offering/academic-offering.module';

@Module({
  imports: [BusinessUnitModule, AdminUserModule, AcademicOfferingModule],
})
export class SGAModule {}
