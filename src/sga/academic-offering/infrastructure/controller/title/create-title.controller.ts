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
import { CreateTitleHandler } from '#academic-offering/applicaton/title/create-title/create-title.handler';
import { CreateTitleCommand } from '#academic-offering/applicaton/title/create-title/create-title.command';
import { createTitleSchema } from '#academic-offering/infrastructure/config/validation-schema/create-title.schema';

interface CreateTitleBody {
  id: string;
  name: string;
  officialCode: string | null;
  officialTitle: string;
  officialProgram: string;
  businessUnit: string;
}

@Controller('title')
export class CreateTitleController {
  constructor(private readonly handler: CreateTitleHandler) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new JoiRequestBodyValidationPipe(createTitleSchema))
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.GESTOR_360,
  )
  async createTitle(
    @Body() body: CreateTitleBody,
    @Request() request: AuthRequest,
  ) {
    const command = new CreateTitleCommand(
      body.id,
      body.name,
      body.officialCode,
      body.officialTitle,
      body.officialProgram,
      body.businessUnit,
      request.user,
    );
    await this.handler.handle(command);
  }
}
