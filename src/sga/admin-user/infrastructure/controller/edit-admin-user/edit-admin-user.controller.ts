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
import { IdentityDocumentValues } from '#/sga/shared/domain/value-object/identity-document';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { EditAdminUserCommand } from '#admin-user/application/edit-admin-user/edit-admin-user.command';
import { EditAdminUserHandler } from '#admin-user/application/edit-admin-user/edit-admin-user.handler';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { editAdminUserSchema } from '#admin-user/infrastructure/config/validation-schema/edit-admin-user.schema';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';

interface EditAdminUserBody {
  name: string;
  surname: string;
  surname2: string | null;
  identityDocument: IdentityDocumentValues;
  roles: AdminUserRoles[];
  avatar: string;
}

@Controller('admin-user')
export class EditAdminUserController {
  constructor(private readonly editAdminUserHandler: EditAdminUserHandler) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.SUPERVISOR_JEFATURA,
    AdminUserRoles.SUPERVISOR_SECRETARIA,
  )
  @Put(':id')
  @UsePipes(
    new JoiRequestParamIdValidationPipeService(uuidSchema),
    new JoiRequestBodyValidationPipe(editAdminUserSchema),
  )
  async edit(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() body: EditAdminUserBody,
  ) {
    const command = new EditAdminUserCommand(
      id,
      body.name,
      body.surname,
      body.surname2,
      body.identityDocument,
      body.roles,
      req.user,
      body.avatar,
    );

    return await this.editAdminUserHandler.handle(command);
  }
}
