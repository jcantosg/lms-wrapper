import {
  Body,
  Controller,
  Param,
  Put,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AcademicRecordModalityEnum } from '#student/domain/enum/academic-record-modality.enum';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { AcademicRecordStatusEnum } from '#student/domain/enum/academic-record-status.enum';
import { EditAcademicRecordHandler } from '#student/application/academic-record/edit-academic-record/edit-academic-record.handler';
import { EditAcademicRecordCommand } from '#student/application/academic-record/edit-academic-record/edit-academic-record.command';
import { editAcademicRecordSchema } from '#student/infrastructure/config/validation-schema/edit-academic-record.schema';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';

interface EditAcademicRecordBody {
  modality: AcademicRecordModalityEnum;
  status: AcademicRecordStatusEnum;
  isModular: boolean;
}

@Controller('academic-record')
export class EditAcademicRecordController {
  constructor(private readonly handler: EditAcademicRecordHandler) {}

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.GESTOR_360,
  )
  @UsePipes(
    new JoiRequestParamIdValidationPipeService(uuidSchema),
    new JoiRequestBodyValidationPipe(editAcademicRecordSchema),
  )
  async editAcademicRecord(
    @Param('id') id: string,
    @Body() body: EditAcademicRecordBody,
    @Request() req: AuthRequest,
  ): Promise<void> {
    const command = new EditAcademicRecordCommand(
      id,
      body.status,
      body.modality,
      body.isModular,
      req.user,
    );

    await this.handler.handle(command);
  }
}
