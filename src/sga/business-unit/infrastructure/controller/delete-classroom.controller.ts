import {
  Controller,
  Delete,
  Param,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { DeleteClassroomHandler } from '#business-unit/application/delete-classroom/delete-classroom.handler';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { DeleteClassroomCommand } from '#business-unit/application/delete-classroom/delete-classroom.command';
import { AuthRequest } from '#shared/infrastructure/http/request';

@Controller('classroom')
export class DeleteClassroomController {
  constructor(private handler: DeleteClassroomHandler) {}

  @Delete(':classroomId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminUserRoles.SUPERADMIN)
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  async deleteClassroom(
    @Param('classroomId') classroomId: string,
    @Req() req: AuthRequest,
  ) {
    const command = new DeleteClassroomCommand(
      classroomId,
      req.user.businessUnits,
    );
    await this.handler.handle(command);
  }
}
