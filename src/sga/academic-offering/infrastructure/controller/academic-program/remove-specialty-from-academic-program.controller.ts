import {
  Body,
  Controller,
  Param,
  Put,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { addSpecialtyToAcademicProgramSchema } from '#academic-offering/infrastructure/config/validation-schema/add-specialty-to-academic-program.schema';
import { RemoveSpecialtyFromAcademicProgramCommand } from '#academic-offering/applicaton/academic-program/remove-specialty-from-academic-program/remove-specialty-from-academic-program.command';
import { RemoveSpecialtyFromAcademicProgramHandler } from '#academic-offering/applicaton/academic-program/remove-specialty-from-academic-program/remove-specialty-from-academic-program.handler';

interface RemoveSpecialtyFromAcademicProgramBody {
  subjectId: string;
}

@Controller('academic-program')
export class RemoveSpecialtyFromAcademicProgramController {
  constructor(
    private readonly handler: RemoveSpecialtyFromAcademicProgramHandler,
  ) {}

  @Put(':id/remove-specialty')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(
    new JoiRequestParamIdValidationPipeService(uuidSchema),
    new JoiRequestBodyValidationPipe(addSpecialtyToAcademicProgramSchema),
  )
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.GESTOR_360,
    AdminUserRoles.SUPERVISOR_360,
  )
  async removeSpecialtyFromAcademicProgram(
    @Param('id') academicProgramId: string,
    @Body() body: RemoveSpecialtyFromAcademicProgramBody,
    @Request() request: AuthRequest,
  ) {
    const command = new RemoveSpecialtyFromAcademicProgramCommand(
      body.subjectId,
      academicProgramId,
      request.user,
    );
    await this.handler.handle(command);
  }
}
