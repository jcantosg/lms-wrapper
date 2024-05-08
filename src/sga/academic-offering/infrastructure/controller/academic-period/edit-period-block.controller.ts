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
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { EditPeriodBlockHandler } from '#academic-offering/applicaton/academic-period/edit-period-block/edit-period-block.handler';
import { EditPeriodBlockCommand } from '#academic-offering/applicaton/academic-period/edit-period-block/edit-period-block.command';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { editPeriodBlockSchema } from '#academic-offering/infrastructure/config/validation-schema/edit-period-block.schema';

export interface PeriodBlockBody {
  startDate: Date;
}

@Controller('period-block')
export class EditPeriodBlockController {
  constructor(private readonly handler: EditPeriodBlockHandler) {}

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(
    new JoiRequestParamIdValidationPipeService(uuidSchema),
    new JoiRequestBodyValidationPipe(editPeriodBlockSchema),
  )
  @Roles(AdminUserRoles.SUPERADMIN, AdminUserRoles.SUPERVISOR_360)
  async editPeriodBlock(
    @Param('id') id: string,
    @Body() body: PeriodBlockBody,
    @Req() req: AuthRequest,
  ) {
    const command = new EditPeriodBlockCommand(
      id,
      body.startDate,
      req.user.businessUnits.map((bu) => bu.id),
      req.user.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    await this.handler.handle(command);
  }
}
