import {
  Body,
  Controller,
  Param,
  Put,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UpdateStudentPasswordHandler } from '#student/application/update-password/update-student-password.handler';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { updateStudentPasswordSchema } from '#student/infrastructure/config/validation-schema/update-student-password.schema';
import { UpdateStudentPasswordCommand } from '#student/application/update-password/update-student-password.command';

interface UpdatePasswordBody {
  newPassword: string;
}

@Controller('student')
export class UpdateStudentPasswordController {
  constructor(private readonly handler: UpdateStudentPasswordHandler) {}

  @Put(':id/password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.GESTOR_360,
  )
  @UsePipes(new JoiRequestBodyValidationPipe(updateStudentPasswordSchema))
  async updateStudentPassword(
    @Param('id') id: string,
    @Body() body: UpdatePasswordBody,
    @Request() req: AuthRequest,
  ) {
    const command = new UpdateStudentPasswordCommand(
      id,
      body.newPassword,
      req.user,
    );
    await this.handler.handle(command);
  }
}
