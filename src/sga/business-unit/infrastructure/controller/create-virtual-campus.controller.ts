import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CreateVirtualCampusHandler } from '#business-unit/application/create-virtual-campus/create-virtual-campus.handler';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { createVirtualCampusSchema } from '#business-unit/infrastructure/config/validation-schema/create-virtual-campus.schema';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { CreateVirtualCampusCommand } from '#business-unit/application/create-virtual-campus/create-virtual-campus.command';

type CreateVirtualCampusBody = {
  id: string;
  name: string;
  code: string;
  businessUnitId: string;
};

@Controller('virtual-campus')
export class CreateVirtualCampusController {
  constructor(private handler: CreateVirtualCampusHandler) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminUserRoles.SUPERADMIN)
  @Post()
  @UsePipes(new JoiRequestBodyValidationPipe(createVirtualCampusSchema))
  async createVirtualCampus(
    @Body() body: CreateVirtualCampusBody,
    @Request() req: AuthRequest,
  ) {
    const command = new CreateVirtualCampusCommand(
      body.id,
      body.name,
      body.code,
      body.businessUnitId,
      req.user,
    );
    await this.handler.handle(command);
  }
}
