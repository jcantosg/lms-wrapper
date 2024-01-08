import { Controller, Get, Param, UseGuards, UsePipes } from '@nestjs/common';
import { GetBusinessUnitHandler } from '#business-unit/application/get-business-unit/get-business-unit.handler';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { GetBusinessUnitQuery } from '#business-unit/application/get-business-unit/get-business-unit.query';
import { GetBusinessUnitResponse } from '#business-unit/infrastructure/controller/get-business-unit/get-business-unit.response';

@Controller('business-unit')
export class GetBusinessUnitController {
  constructor(private readonly handler: GetBusinessUnitHandler) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminUserRoles.SUPERADMIN)
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  async getBusinessUnit(@Param('id') id: string) {
    const query = new GetBusinessUnitQuery(id);

    const businessUnit = await this.handler.handle(query);

    return GetBusinessUnitResponse.create(businessUnit);
  }
}
