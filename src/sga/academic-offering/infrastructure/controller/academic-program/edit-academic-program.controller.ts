import {
  Body,
  Controller,
  Param,
  Put,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { EditAcademicProgramHandler } from '#academic-offering/applicaton/academic-program/edit-academic-program/edit-academic-program.handler';
import { EditAcademicProgramCommand } from '#academic-offering/applicaton/academic-program/edit-academic-program/edit-academic-program.command';
import { editAcademicProgramSchema } from '#academic-offering/infrastructure/config/validation-schema/edit-academic-program.schema';

interface EditAcademicProgramBody {
  name: string;
  code: string;
  title: string;
}

@Controller('academic-program')
export class EditAcademicProgramController {
  constructor(private readonly handler: EditAcademicProgramHandler) {}

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(
    new JoiRequestParamIdValidationPipeService(uuidSchema),
    new JoiRequestBodyValidationPipe(editAcademicProgramSchema),
  )
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.GESTOR_360,
  )
  async editAcademicProgram(
    @Param('id') id: string,
    @Body() body: EditAcademicProgramBody,
    @Request() request: AuthRequest,
  ) {
    const command = new EditAcademicProgramCommand(
      id,
      body.name,
      body.code,
      body.title,
      request.user,
    );

    await this.handler.handle(command);
  }
}
