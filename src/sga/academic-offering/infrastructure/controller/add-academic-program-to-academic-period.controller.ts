import {
  Body,
  Controller,
  Param,
  Put,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AddAcademicProgramToAcademicPeriodHandler } from '#academic-offering/applicaton/add-academic-program-to-academic-period/add-academic-program-to-academic-period.handler';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { AddAcademicProgramToAcademicPeriodCommand } from '#academic-offering/applicaton/add-academic-program-to-academic-period/add-academic-program-to-academic-period.command';
import { addAcademicProgramsToAcademicPeriodSchema } from '#academic-offering/infrastructure/config/validation-schema/add-academic-programs-to-academic-period.schema';

interface AddAcademicProgramToAcademicPeriodBody {
  academicProgramId: string;
}

@Controller('academic-period')
export class AddAcademicProgramToAcademicPeriodController {
  constructor(private handler: AddAcademicProgramToAcademicPeriodHandler) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.GESTOR_360,
    AdminUserRoles.SUPERVISOR_360,
  )
  @Put(':id/add-academic-program')
  @UsePipes(
    new JoiRequestParamIdValidationPipeService(uuidSchema),
    new JoiRequestBodyValidationPipe(addAcademicProgramsToAcademicPeriodSchema),
  )
  async addAcademicProgramsToAcademicPeriod(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() body: AddAcademicProgramToAcademicPeriodBody,
  ): Promise<void> {
    const command = new AddAcademicProgramToAcademicPeriodCommand(
      id,
      body.academicProgramId,
      req.user,
    );

    await this.handler.handle(command);
  }
}
