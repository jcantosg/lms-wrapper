import { RegisterAdminUserCommand } from '#admin-user/application/register-admin-user/register-admin-user.command';
import { RegisterAdminUserHandler } from '#admin-user/application/register-admin-user/register-admin-user.handler';
import { registerAdminUserSchema } from '#admin-user/infrastructure/config/validation-schema/register-admin-user.schema';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { IdentityDocumentValues } from '#/sga/shared/domain/value-object/identity-document';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';

interface RegisterAdminUserBody {
  id: string;
  email: string;
  roles: AdminUserRoles[];
  name: string;
  businessUnits: string[];
  surname: string;
  identityDocument: IdentityDocumentValues;
  surname2: string | null;
  avatar: string | undefined;
}

@Controller('auth')
export class RegisterAdminUserController {
  constructor(
    private readonly registerAdminUserHandler: RegisterAdminUserHandler,
  ) {}

  @Post('register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.SUPERVISOR_JEFATURA,
    AdminUserRoles.SUPERVISOR_SECRETARIA,
  )
  @UsePipes(new JoiRequestBodyValidationPipe(registerAdminUserSchema))
  async register(
    @Body() body: RegisterAdminUserBody,
    @Request() req: AuthRequest,
  ) {
    const command = new RegisterAdminUserCommand(
      body.id,
      body.email,
      body.roles,
      body.name,
      body.businessUnits,
      body.surname,
      body.identityDocument,
      body.surname2,
      req.user,
      body.avatar,
    );

    return await this.registerAdminUserHandler.handle(command);
  }
}
