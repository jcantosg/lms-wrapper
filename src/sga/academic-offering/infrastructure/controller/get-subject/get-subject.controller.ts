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
import { GetSubjectHandler } from '#academic-offering/applicaton/get-subject/get-subject.handler';
import { GetSubjectQuery } from '#academic-offering/applicaton/get-subject/get-subject.query';
import { GetSubjectResponse } from '#academic-offering/infrastructure/controller/get-subject/get-subject.response';

@Controller('subject')
export class GetSubjectController {
  constructor(private handler: GetSubjectHandler) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  @Get(':id')
  async getSubject(@Param('id') id: string, @Req() req: AuthRequest) {
    const query = new GetSubjectQuery(
      id,
      req.user.businessUnits.map((bu) => bu.id),
      req.user.roles.includes(AdminUserRoles.SUPERADMIN),
    );
    const subject = await this.handler.handle(query);

    return GetSubjectResponse.create(subject);
  }
}
