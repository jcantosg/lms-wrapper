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
import { SubjectModality } from '#academic-offering/domain/enum/subject-modality.enum';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { EditSubjectHandler } from '#academic-offering/applicaton/subject/edit-subject/edit-subject.handler';
import { EditSubjectCommand } from '#academic-offering/applicaton/subject/edit-subject/edit-subject.command';
import { editSubjectSchema } from '#academic-offering/infrastructure/config/validation-schema/edit-subject.schema';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';

interface EditSubjectBody {
  name: string;
  code: string;
  hours: number;
  officialCode: string | null;
  image: string | null;
  modality: SubjectModality;
  evaluationType: string | null;
  type: SubjectType;
  isRegulated: boolean;
  isCore: boolean;
  officialRegionalCode: string | null;
  lmsCourseId: number | null | undefined;
}

@Controller('subject')
export class EditSubjectController {
  constructor(private readonly handler: EditSubjectHandler) {}

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.GESTOR_360,
    AdminUserRoles.SUPERVISOR_360,
  )
  @UsePipes(
    new JoiRequestParamIdValidationPipeService(uuidSchema),
    new JoiRequestBodyValidationPipe(editSubjectSchema),
  )
  async editSubject(
    @Param('id') id: string,
    @Body() body: EditSubjectBody,
    @Request() req: AuthRequest,
  ): Promise<void> {
    const command = new EditSubjectCommand(
      id,
      body.name,
      body.code,
      body.hours,
      body.officialCode,
      body.modality,
      body.evaluationType,
      body.image,
      body.type,
      body.isRegulated,
      body.isCore,
      req.user,
      body.officialRegionalCode,
      body.lmsCourseId,
    );

    await this.handler.handle(command);
  }
}
