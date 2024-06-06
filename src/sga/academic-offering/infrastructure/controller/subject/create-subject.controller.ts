import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { SubjectModality } from '#academic-offering/domain/enum/subject-modality.enum';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { CreateSubjectHandler } from '#academic-offering/applicaton/subject/create-subject/create-subject.handler';
import { CreateSubjectCommand } from '#academic-offering/applicaton/subject/create-subject/create-subject.command';
import { createSubjectSchema } from '#academic-offering/infrastructure/config/validation-schema/create-subject.schema';

interface CreateSubjectBody {
  id: string;
  image: string | null;
  name: string;
  code: string;
  hours: number | null;
  officialCode: string | null;
  modality: SubjectModality;
  evaluationType: string;
  type: SubjectType;
  businessUnit: string;
  isRegulated: boolean;
  isCore: boolean;
  officialRegionalCode: string | null;
  lmsCourseId: number | null;
}

@Controller('subject')
export class CreateSubjectController {
  constructor(private readonly handler: CreateSubjectHandler) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new JoiRequestBodyValidationPipe(createSubjectSchema))
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.GESTOR_360,
  )
  async createSubject(
    @Body() body: CreateSubjectBody,
    @Request() request: AuthRequest,
  ) {
    const command = new CreateSubjectCommand(
      body.id,
      body.name,
      body.code,
      body.image,
      body.officialCode,
      body.hours,
      body.modality,
      body.evaluationType,
      body.type,
      body.businessUnit,
      body.isRegulated,
      body.isCore,
      request.user,
      body.officialRegionalCode,
      body.lmsCourseId,
    );
    await this.handler.handle(command);
  }
}
