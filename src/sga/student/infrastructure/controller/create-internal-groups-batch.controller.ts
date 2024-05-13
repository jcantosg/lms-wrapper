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
import { createInternalGroupsBatchSchema } from '#student/infrastructure/config/validation-schema/create-internal-group-batch.schema';
import { CreateInternalGroupsBatchCommand } from '#student/application/create-internal-group-batch/create-internal-group-batch.command';
import { CreateInternalGroupsBatchHandler } from '#student/application/create-internal-group-batch/create-internal-group-batch.handler';

interface CreateInternalGroupsBatchBody {
  academicPeriodId: string;
  prefix?: string;
  sufix?: string;
  academicPrograms: string[];
  isDefault: boolean;
}

@Controller('internal-group')
export class CreateInternalGroupsBatchController {
  constructor(private readonly handler: CreateInternalGroupsBatchHandler) {}

  @Post('batch')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.GESTOR_360,
  )
  @UsePipes(new JoiRequestBodyValidationPipe(createInternalGroupsBatchSchema))
  async createInternalGroupsBatch(
    @Body() body: CreateInternalGroupsBatchBody,
    @Request() request: AuthRequest,
  ): Promise<void> {
    const command = new CreateInternalGroupsBatchCommand(
      body.academicPeriodId,
      body.prefix ?? null,
      body.sufix ?? null,
      body.academicPrograms,
      body.isDefault,
      request.user,
    );
    await this.handler.handle(command);
  }
}
