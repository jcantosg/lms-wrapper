import {
  Body,
  Controller,
  Param,
  Put,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { EditProgramBlockHandler } from '#academic-offering/applicaton/program-block/edit-program-block/edit-program-block.handler';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { EditProgramBlockCommand } from '#academic-offering/applicaton/program-block/edit-program-block/edit-program-block.command';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { editProgramBlockSchema } from '#academic-offering/infrastructure/config/validation-schema/edit-program-block.schema';

interface EditProgramBlockBody {
  name: string;
}

@Controller('program-block')
export class EditProgramBlockController {
  constructor(private readonly handler: EditProgramBlockHandler) {}

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.GESTOR_360,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.SUPERADMIN,
  )
  @UsePipes(
    new JoiRequestParamIdValidationPipeService(uuidSchema),
    new JoiRequestBodyValidationPipe(editProgramBlockSchema),
  )
  async editProgramBlock(
    @Body() body: EditProgramBlockBody,
    @Param('id') id: string,
    @Request() req: AuthRequest,
  ) {
    const command = new EditProgramBlockCommand(id, body.name, req.user);
    await this.handler.handle(command);
  }
}
