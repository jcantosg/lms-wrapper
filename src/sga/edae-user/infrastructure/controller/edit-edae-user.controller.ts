import {
  Body,
  Controller,
  Param,
  Put,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { EditEdaeUserHandler } from '#edae-user/application/edit-edae-user/edit-edae-user.handler';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { editEdaeUserSchema } from '#edae-user/infrastructure/config/validation-schema/edit-edae-user.schema';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { IdentityDocumentValues } from '#/sga/shared/domain/value-object/identity-document';
import { EdaeRoles } from '#/sga/shared/domain/enum/edae-user-roles.enum';
import { TimeZoneEnum } from '#/sga/shared/domain/enum/time-zone.enum';
import { EditEdaeUserCommand } from '#edae-user/application/edit-edae-user/edit-edae-user.command';

interface EditEdaeUserBody {
  name: string;
  surname1: string;
  surname2: string | null;
  identityDocument: IdentityDocumentValues;
  roles: EdaeRoles[];
  timeZone: TimeZoneEnum;
  isRemote: boolean;
  location: string;
  avatar: string | null;
}

@Controller('edae-user')
export class EditEdaeUserController {
  constructor(private readonly handler: EditEdaeUserHandler) {}

  @Put(':id')
  @UsePipes(new JoiRequestBodyValidationPipe(editEdaeUserSchema))
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.GESTOR_360,
  )
  async editEdaeUser(
    @Param('id') id: string,
    @Request() req: AuthRequest,
    @Body() body: EditEdaeUserBody,
  ) {
    const command = new EditEdaeUserCommand(
      id,
      body.name,
      body.surname1,
      body.identityDocument,
      body.roles,
      body.timeZone,
      body.isRemote,
      body.location,
      body.surname2,
      body.avatar,
      req.user,
    );
    await this.handler.handle(command);
  }
}
