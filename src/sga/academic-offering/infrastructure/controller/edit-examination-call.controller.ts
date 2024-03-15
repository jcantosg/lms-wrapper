import {
  Body,
  Controller,
  Param,
  Put,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { editExaminationCallSchema } from '#academic-offering/infrastructure/config/validation-schema/edit-examination-call.schema';
import { EditExaminationCallCommand } from '#academic-offering/applicaton/edit-examination-call/edit-examination-call.command';
import { EditExaminationCallHandler } from '#academic-offering/applicaton/edit-examination-call/edit-examination-call.handler';

interface EditExaminationCallBody {
  name: string;
  startDate: Date;
  endDate: Date;
}

@Controller('examination-call')
export class EditExaminationCallController {
  constructor(private readonly handler: EditExaminationCallHandler) {}

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminUserRoles.SUPERADMIN, AdminUserRoles.GESTOR_360)
  @UsePipes(new JoiRequestBodyValidationPipe(editExaminationCallSchema))
  async editExaminationCall(
    @Param('id') id: string,
    @Body() body: EditExaminationCallBody,
    @Request() req: AuthRequest,
  ): Promise<void> {
    const command = new EditExaminationCallCommand(
      id,
      body.name,
      body.startDate,
      body.endDate,
      req.user.businessUnits.map((bu) => bu.id),
      req.user.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    await this.handler.handle(command);
  }
}
