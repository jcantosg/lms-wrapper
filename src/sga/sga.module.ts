import { AdminUserModule } from '#admin-user/admin-user.module';
import { BusinessUnitModule } from '#business-unit/business-unit.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [BusinessUnitModule, AdminUserModule],
})
export class SGAModule {}
