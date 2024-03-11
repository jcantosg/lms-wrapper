import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { GetEdaeUserHandler } from '#edae-user/application/get-edae-user/get-edae-user.handler';
import { GetEdaeUserQuery } from '#edae-user/application/get-edae-user/get-edae-user.query';
import { GetEdaeUserResponse } from '#edae-user/infrastructure/controller/get-edae-user/get-edae-user.response';

@Controller('edae-user')
export class GetEdaeUserController {
  constructor(private handler: GetEdaeUserHandler) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  @Get(':id')
  async getEdaeUser(@Param('id') id: string, @Req() req: AuthRequest) {
    const query = new GetEdaeUserQuery(
      id,
      req.user.businessUnits.map((bu) => bu.id),
      req.user.roles.includes(AdminUserRoles.SUPERADMIN),
    );
    const edaeUser = await this.handler.handle(query);

    return GetEdaeUserResponse.create(edaeUser);
  }
}
