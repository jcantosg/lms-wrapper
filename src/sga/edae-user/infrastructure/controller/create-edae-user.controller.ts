import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { CreateEdaeUserCommand } from '#/sga/edae-user/application/edae-user/create-edae-user/create-edae-user.command';
import { CreateEdaeUserHandler } from '#/sga/edae-user/application/edae-user/create-edae-user/create-edae-user.handler';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { createEdaeUserSchema } from '../config/schema/create-edae-user.schema';
import { IdentityDocumentValues } from '#/sga/shared/domain/value-object/identity-document';
import { EdaeRoles } from '#/sga/shared/domain/enum/edae-user-roles.enum';
import { TimeZoneEnum } from '#/sga/shared/domain/enum/time-zone.enum';

interface CreateEdaeUserBody {
  id: string;
  name: string;
  surname1: string;
  surname2: string | null;
  email: string;
  identityDocument: IdentityDocumentValues;
  roles: EdaeRoles[];
  businessUnits: string[];
  timeZone: TimeZoneEnum;
  isRemote: boolean;
  location: string;
  avatar: string | null;
}
@Controller('edae-user')
export class CreateEdaeUserController {
  constructor(private readonly handler: CreateEdaeUserHandler) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.GESTOR_360,
    AdminUserRoles.SUPERVISOR_360,
  )
  @Post()
  @UsePipes(new JoiRequestBodyValidationPipe(createEdaeUserSchema))
  async createEdaeUser(
    @Body() body: CreateEdaeUserBody,
    @Request() req: AuthRequest,
  ) {
    const command = new CreateEdaeUserCommand(
      body.id,
      body.name,
      body.surname1,
      body.surname2,
      body.email,
      body.identityDocument,
      body.roles,
      body.businessUnits,
      req.user.businessUnits.map((bu) => bu.id),
      body.timeZone,
      body.isRemote,
      body.location,
      body.avatar,
    );

    await this.handler.handle(command);
  }
}
