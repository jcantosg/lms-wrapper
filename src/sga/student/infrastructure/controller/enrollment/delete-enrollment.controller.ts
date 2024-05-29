import { Controller, Delete, Param, UseGuards, UsePipes } from '@nestjs/common';
import { DeleteEnrollmentHandler } from '#student/application/enrollment/delete-enrollment/delete-enrollment.handler';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { DeleteEnrollmentCommand } from '#student/application/enrollment/delete-enrollment/delete-enrollment.command';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

@Controller('enrollment')
export class DeleteEnrollmentController {
  constructor(private readonly handler: DeleteEnrollmentHandler) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.GESTOR_360,
  )
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  async handle(@Param('id') id: string): Promise<void> {
    const command = new DeleteEnrollmentCommand(id);

    await this.handler.handle(command);
  }
}
