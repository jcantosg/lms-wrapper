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
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { CreateProgramBlockHandler } from '#academic-offering/applicaton/program-block/create-program-block/create-program-block.handler';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { CreateProgramBlockCommand } from '#academic-offering/applicaton/program-block/create-program-block/create-program-block.command';
import { ProgramBlockStructureType } from '#academic-offering/domain/enum/program-block-structure-type.enum';
import { createProgramBlockSchema } from '#academic-offering/infrastructure/config/validation-schema/create-program-block.schema';

interface CreateProgramBlockBody {
  academicProgramId: string;
  structureType: ProgramBlockStructureType;
  blocks: string[];
}

@Controller('program-block')
export class CreateProgramBlockController {
  constructor(private readonly handler: CreateProgramBlockHandler) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new JoiRequestBodyValidationPipe(createProgramBlockSchema))
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.GESTOR_360,
  )
  async createProgramBlock(
    @Body() body: CreateProgramBlockBody,
    @Request() req: AuthRequest,
  ) {
    const command = new CreateProgramBlockCommand(
      body.academicProgramId,
      body.structureType,
      body.blocks,
      req.user,
    );

    await this.handler.handle(command);
  }
}
