import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { GetAllSubjectEdaeUsersQuery } from '#academic-offering/applicaton/subject/get-all-subject-edae-users/get-all-subject-edae-users.query';
import { GetAllSubjectEdaeUsersHandler } from '#academic-offering/applicaton/subject/get-all-subject-edae-users/get-all-subject-edae-users.handler';
import { GetAllSubjectEdaeUsersResponse } from '#academic-offering/infrastructure/controller/subject/get-all-subject-edae-users/get-all-subject-edae-users.response';

@Controller('subject')
export class GetAllSubjectEdaeUsersController {
  constructor(private readonly handler: GetAllSubjectEdaeUsersHandler) {}

  @Get(':id/teachers')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  async getAllSubjectEdaeUsers(
    @Param('id') id: string,
    @Req() req: AuthRequest,
  ) {
    const data = await this.handler.handle(
      new GetAllSubjectEdaeUsersQuery(
        id,
        req.user.businessUnits.map((bu) => bu.id),
        req.user.roles.includes(AdminUserRoles.SUPERADMIN),
      ),
    );

    return GetAllSubjectEdaeUsersResponse.create(data);
  }
}
