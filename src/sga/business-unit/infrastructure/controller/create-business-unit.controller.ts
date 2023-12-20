import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { CreateBusinessUnitCommand } from '#business-unit/application/create-business-unit/create-business-unit.command';
import { CreateBusinessUnitHandler } from '#business-unit/application/create-business-unit/create-business-unit.handler';
import { createBusinessUnitSchema } from '#business-unit/infrastructure/config/validation-schema/create-business-unit.schema';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';

@Controller('business-unit')
export class CreateBusinessUnitController {
  constructor(private readonly handler: CreateBusinessUnitHandler) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminUserRoles.SUPERADMIN)
  @Post()
  @UsePipes(new JoiRequestBodyValidationPipe(createBusinessUnitSchema))
  async createBusinessUnit(@Body() body: any, @Request() req: AuthRequest) {
    const command = new CreateBusinessUnitCommand(
      body.id,
      body.name,
      body.code,
      body.countryId,
      req.user.id,
    );

    await this.handler.handle(command);
  }
}
