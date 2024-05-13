import { CreateAdministrativeGroupHandler } from '#student/application/administrative-group/create-administrative-group/create-administrative-group.handler';
import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { CreateAdministrativeGroupCommand } from '#student/application/administrative-group/create-administrative-group/create-administrative-group.command';
import { createAdministrativeGroupSchema } from '#student/infrastructure/config/validation-schema/create-administrative-group.schema';

interface CreateAdministrativeGroupBody {
  academicProgramIds: string[];
  businessUnitId: string;
  academicPeriodId: string;
}

@Controller('administrative-group')
export class CreateAdministrativeGroupController {
  constructor(private readonly handler: CreateAdministrativeGroupHandler) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.GESTOR_360,
  )
  @UsePipes(new JoiRequestBodyValidationPipe(createAdministrativeGroupSchema))
  async createAdministrativeGroup(
    @Body() body: CreateAdministrativeGroupBody,
    @Request() req: AuthRequest,
  ) {
    const command = new CreateAdministrativeGroupCommand(
      body.academicProgramIds,
      body.businessUnitId,
      body.academicPeriodId,
      req.user,
    );

    await this.handler.handle(command);
  }
}
