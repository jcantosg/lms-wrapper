import {
  Body,
  Controller,
  Param,
  Put,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { EditAcademicPeriodCommand } from '#academic-offering/applicaton/academic-period/edit-academic-period/edit-academic-period.command';
import { EditAcademicPeriodHandler } from '#academic-offering/applicaton/academic-period/edit-academic-period/edit-academic-period.handler';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { editAcademicPeriodSchema } from '#academic-offering/infrastructure/config/validation-schema/edit-academic-period.schema';

interface EditAcademicPeriodBody {
  name: string;
  code: string;
  startDate: Date;
  endDate: Date;
}

@Controller('academic-period')
export class EditAcademicPeriodController {
  constructor(private readonly handler: EditAcademicPeriodHandler) {}

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(
    new JoiRequestParamIdValidationPipeService(uuidSchema),
    new JoiRequestBodyValidationPipe(editAcademicPeriodSchema),
  )
  @Roles(AdminUserRoles.SUPERADMIN, AdminUserRoles.SUPERVISOR_360)
  async createAcademicPeriod(
    @Param('id') id: string,
    @Body() body: EditAcademicPeriodBody,
    @Req() req: AuthRequest,
  ) {
    const command = new EditAcademicPeriodCommand(
      id,
      body.name,
      body.code,
      body.startDate,
      body.endDate,
      req.user.businessUnits.map((bu) => bu.id),
      req.user.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    await this.handler.handle(command);
  }
}
