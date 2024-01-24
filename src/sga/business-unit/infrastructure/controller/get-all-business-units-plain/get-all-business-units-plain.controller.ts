import { Controller, Get, UseGuards } from '@nestjs/common';
import { BusinessUnitResponseBasic } from '#business-unit/infrastructure/controller/get-all-business-units/get-business-unit.response';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { GetAllBusinessUnitsPlainHandler } from '#business-unit/application/get-all-business-units-plain/get-all-business-units-plain.handler';
import { GetAllBusinessUnitPlainResponse } from '#business-unit/infrastructure/controller/get-all-business-units-plain/get-all-business-units-plain.response';

@Controller('business-unit')
export class GetAllBusinessPlainController {
  constructor(private readonly handler: GetAllBusinessUnitsPlainHandler) {}

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminUserRoles.SUPERADMIN)
  async getAllBusinessUnitsPlain(): Promise<BusinessUnitResponseBasic[]> {
    const response = await this.handler.handle();

    return GetAllBusinessUnitPlainResponse.create(response);
  }
}
