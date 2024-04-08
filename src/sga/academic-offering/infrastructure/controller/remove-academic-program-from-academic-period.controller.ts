import {
  Body,
  Controller,
  Param,
  Put,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { removeAcademicProgramFromAcademicPeriodSchema } from '#academic-offering/infrastructure/config/validation-schema/remove-academic-program-from-academic-period.schema';
import { RemoveAcademicProgramFromAcademicPeriodCommand } from '#academic-offering/applicaton/remove-academic-program-from-academic-period/remove-academic-program-from-academic-period.command';
import { RemoveAcademicProgramFromAcademicPeriodHandler } from '#academic-offering/applicaton/remove-academic-program-from-academic-period/remove-academic-program-from-academic-period.handler';

interface RemoveAcademicProgramFromAcademicPeriodBody {
  academicProgramId: string;
}

@Controller('academic-period')
export class RemoveAcademicProgramFromAcademicPeriodController {
  constructor(
    private readonly handler: RemoveAcademicProgramFromAcademicPeriodHandler,
  ) {}
  @Put(':id/remove-academic-program')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(
    new JoiRequestParamIdValidationPipeService(uuidSchema),
    new JoiRequestBodyValidationPipe(
      removeAcademicProgramFromAcademicPeriodSchema,
    ),
  )
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.GESTOR_360,
  )
  async removeAcademicProgramFromAcademicPeriod(
    @Param('id') id: string,
    @Body() body: RemoveAcademicProgramFromAcademicPeriodBody,
    @Request() request: AuthRequest,
  ) {
    const command = new RemoveAcademicProgramFromAcademicPeriodCommand(
      id,
      body.academicProgramId,
      request.user,
    );

    await this.handler.handle(command);
  }
}
