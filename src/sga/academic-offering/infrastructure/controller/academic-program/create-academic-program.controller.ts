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
import { CreateAcademicProgramHandler } from '#academic-offering/applicaton/academic-program/create-academic-program/create-academic-program.handler';
import { CreateAcademicProgramCommand } from '#academic-offering/applicaton/academic-program/create-academic-program/create-academic-program.command';
import { ProgramBlockStructureType } from '#academic-offering/domain/enum/program-block-structure-type.enum';

interface CreateAcademicProgramBody {
  id: string;
  name: string;
  code: string;
  title: string;
  businessUnit: string;
  structureType: ProgramBlockStructureType;
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
      body.structureType,
    );
    await this.handler.handle(command);
  }
}
