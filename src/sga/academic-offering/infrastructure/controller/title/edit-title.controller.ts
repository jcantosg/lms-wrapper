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
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { EditTitleHandler } from '#academic-offering/applicaton/title/edit-title/edit-title.handler';
import { EditTitleCommand } from '#academic-offering/applicaton/title/edit-title/edit-title.command';
import { editTitleSchema } from '#academic-offering/infrastructure/config/validation-schema/edit-title.schema';

interface EditTitleBody {
  name: string;
  officialCode: string | null;
  officialTitle: string;
  officialProgram: string;
  businessUnit: string;
}

@Controller('title')
export class EditTitleController {
  constructor(private readonly handler: EditTitleHandler) {}

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(
    new JoiRequestParamIdValidationPipeService(uuidSchema),
    new JoiRequestBodyValidationPipe(editTitleSchema),
  )
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.GESTOR_360,
  )
  async editTitle(
    @Body() body: EditTitleBody,
    @Param('id') id: string,
    @Request() request: AuthRequest,
  ) {
    const command = new EditTitleCommand(
      id,
      body.name,
      body.officialCode,
      body.officialTitle,
      body.officialProgram,
      body.businessUnit,
      request.user,
    );
    await this.handler.handle(command);
  }
}
