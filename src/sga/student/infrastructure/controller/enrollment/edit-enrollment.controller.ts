import {
  Body,
  Controller,
  Param,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { EditEnrollmentHandler } from '#student/application/enrollment/edit-enrollment/edit-enrollment.handler';
import { EnrollmentTypeEnum } from '#student/domain/enum/enrollment/enrollment-type.enum';
import { EnrollmentVisibilityEnum } from '#student/domain/enum/enrollment/enrollment-visibility.enum';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { editEnrollmentSchema } from '#student/infrastructure/config/validation-schema/edit-enrollment.schema';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { EditEnrollmentCommand } from '#student/application/enrollment/edit-enrollment/edit-enrollment.command';

interface EditEnrollmentBody {
  type: EnrollmentTypeEnum;
  visibility: EnrollmentVisibilityEnum;
  maxCalls: number;
}

@Controller('enrollment')
export class EditEnrollmentController {
  constructor(private readonly handler: EditEnrollmentHandler) {}

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.GESTOR_360,
    AdminUserRoles.SUPERVISOR_360,
  )
  @UsePipes(
    new JoiRequestBodyValidationPipe(editEnrollmentSchema),
    new JoiRequestParamIdValidationPipeService(uuidSchema),
  )
  async editEnrollment(
    @Body() body: EditEnrollmentBody,
    @Param('id') id: string,
  ): Promise<void> {
    const command = new EditEnrollmentCommand(
      id,
      body.type,
      body.visibility,
      body.maxCalls,
    );
    await this.handler.handle(command);
  }
}
