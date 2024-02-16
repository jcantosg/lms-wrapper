import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CreateClassroomHandler } from '#business-unit/application/classroom/create-classroom/create-classroom.handler';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { createClassroomSchema } from '#business-unit/infrastructure/config/validation-schema/create-classroom.schema';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { CreateClassroomCommand } from '#business-unit/application/classroom/create-classroom/create-classroom.command';

type CreateClassroomBody = {
  id: string;
  name: string;
  code: string;
  capacity: number;
  examinationCenterId: string;
};

@Controller('classroom')
export class CreateClassroomController {
  constructor(private handler: CreateClassroomHandler) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(
    new JoiRequestBodyValidationPipe(createClassroomSchema),
    new JoiRequestParamIdValidationPipeService(uuidSchema),
  )
  @Roles(AdminUserRoles.SUPERADMIN, AdminUserRoles.SUPERVISOR_360)
  async createClassroom(
    @Request() req: AuthRequest,
    @Body() body: CreateClassroomBody,
  ): Promise<void> {
    const command = new CreateClassroomCommand(
      body.id,
      body.name,
      body.code,
      body.capacity,
      body.examinationCenterId,
      req.user,
    );
    await this.handler.handle(command);
  }
}
