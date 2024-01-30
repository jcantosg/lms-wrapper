import {
  Controller,
  Put,
  UseGuards,
  UsePipes,
  Request,
  Param,
  Body,
} from '@nestjs/common';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { EditClassroomCommand } from '#business-unit/application/edit-classroom/edit-classroom.command';
import { EditClassroomHandler } from '#business-unit/application/edit-classroom/edit-classroom.handler';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { editClassroomSchema } from '#business-unit/infrastructure/config/validation-schema/edit-classroom.schema';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';

type EditClassroomEndpointBody = {
  name: string;
  code: string;
  capacity: number;
};

@Controller('classroom')
export class EditClassroomController {
  constructor(private handler: EditClassroomHandler) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminUserRoles.SUPERADMIN)
  @Put(':id')
  @UsePipes(
    new JoiRequestParamIdValidationPipeService(uuidSchema),
    new JoiRequestBodyValidationPipe(editClassroomSchema),
  )
  async editClassroom(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() body: EditClassroomEndpointBody,
  ) {
    const command: EditClassroomCommand = new EditClassroomCommand(
      id,
      body.name,
      body.code,
      body.capacity,
      req.user,
    );

    await this.handler.handle(command);
  }
}
