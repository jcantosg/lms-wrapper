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
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { createAcademicProgramSchema } from '#academic-offering/infrastructure/config/validation-schema/create-academic-program.schema';
import { CreateAcademicProgramCommand } from '#academic-offering/applicaton/create-academic-program/create-academic-program.command';
import { CreateAcademicProgramHandler } from '#academic-offering/applicaton/create-academic-program/create-academic-program.handler';

interface CreateAcademicProgramBody {
  id: string;
  name: string;
  code: string;
  title: string;
  businessUnit: string;
}

@Controller('academic-program')
export class CreateAcademicProgramController {
  constructor(private readonly handler: CreateAcademicProgramHandler) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new JoiRequestBodyValidationPipe(createAcademicProgramSchema))
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.GESTOR_360,
  )
  async createAcademicProgram(
    @Body() body: CreateAcademicProgramBody,
    @Request() request: AuthRequest,
  ) {
    const command = new CreateAcademicProgramCommand(
      body.id,
      body.name,
      body.code,
      body.title,
      body.businessUnit,
      request.user,
    );
    await this.handler.handle(command);
  }
}
