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
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { AddSpecialtyToAcademicProgramHandler } from '#academic-offering/applicaton/academic-program/add-specialty-to-academic-program/add-specialty-to-academic-program.handler';
import { AddSpecialtyToAcademicProgramCommand } from '#academic-offering/applicaton/academic-program/add-specialty-to-academic-program/add-specialty-to-academic-program.command';
import { addSpecialtyToAcademicProgramSchema } from '#academic-offering/infrastructure/config/validation-schema/add-specialty-to-academic-program.schema';

interface AddSpecialtyToAcademicProgramBody {
  subjectId: string;
}

@Controller('academic-program')
export class AddSpecialtyToAcademicProgramController {
  constructor(private readonly handler: AddSpecialtyToAcademicProgramHandler) {}

  @Put(':id/add-specialty')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.GESTOR_360,
  )
  @UsePipes(
    new JoiRequestParamIdValidationPipeService(uuidSchema),
    new JoiRequestBodyValidationPipe(addSpecialtyToAcademicProgramSchema),
  )
  async addSpecialtyToAcademicProgram(
    @Param('id') academicProgramId: string,
    @Body() body: AddSpecialtyToAcademicProgramBody,
    @Request() request: AuthRequest,
  ) {
    const command = new AddSpecialtyToAcademicProgramCommand(
      academicProgramId,
      body.subjectId,
      request.user,
    );
    await this.handler.handle(command);
  }
}
