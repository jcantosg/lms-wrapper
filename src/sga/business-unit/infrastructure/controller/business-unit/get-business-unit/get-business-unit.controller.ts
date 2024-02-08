import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { GetBusinessUnitHandler } from '#business-unit/application/business-unit/get-business-unit/get-business-unit.handler';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { GetBusinessUnitQuery } from '#business-unit/application/business-unit/get-business-unit/get-business-unit.query';
import { GetBusinessUnitResponse } from '#business-unit/infrastructure/controller/business-unit/get-business-unit/get-business-unit.response';
import { AuthRequest } from '#shared/infrastructure/http/request';

@Controller('business-unit')
export class GetBusinessUnitController {
  constructor(private readonly handler: GetBusinessUnitHandler) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminUserRoles.SUPERADMIN)
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  async getBusinessUnit(@Param('id') id: string, @Req() req: AuthRequest) {
    const query = new GetBusinessUnitQuery(
      id,
      req.user.businessUnits.map((bu) => bu.id),
    );

    const businessUnit = await this.handler.handle(query);

    return GetBusinessUnitResponse.create(businessUnit);
  }
}
