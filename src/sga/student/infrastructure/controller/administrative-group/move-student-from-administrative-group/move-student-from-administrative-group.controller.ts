import {
  Controller,
  Put,
  Body,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { MoveStudentFromAdministrativeGroupHandler } from '#student/application/administrative-group/move-student-from-administrative-group/move-student-from-administrative-group.handler';
import { MoveStudentFromAdministrativeGroupCommand } from '#student/application/administrative-group/move-student-from-administrative-group/move-student-from-administrative-group.command';
import { moveStudentFromAdministrativeGroupSchema } from '#student/infrastructure/config/validation-schema/move-student-from-administrative-group.schema';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';

type MoveStudentsRequest = {
  studentIds: string[];
  administrativeGroupOriginId: string;
  administrativeGroupDestinationId: string;
};

@Controller('administrative-group/move')
export class MoveStudentFromAdministrativeGroupController {
  constructor(
    private readonly handler: MoveStudentFromAdministrativeGroupHandler,
  ) {}

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminUserRoles.SUPERADMIN)
  @UsePipes(
    new JoiRequestBodyValidationPipe(moveStudentFromAdministrativeGroupSchema),
  )
  async moveStudents(
    @Body() body: MoveStudentsRequest,
    @Req() req: AuthRequest,
  ): Promise<void> {
    const command = new MoveStudentFromAdministrativeGroupCommand(
      body.studentIds,
      body.administrativeGroupOriginId,
      body.administrativeGroupDestinationId,
      req.user,
    );

    await this.handler.handle(command);
  }
}
