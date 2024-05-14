import {
  Controller,
  Get,
  Param,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { GetSubjectsNotEnrolledHandler } from '#student/application/enrollment/get-subjects-not-enrolled/get-subjects-not-enrolled.handler';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { GetSubjectsNotEnrolledQuery } from '#student/application/enrollment/get-subjects-not-enrolled/get-subjects-not-enrolled.query';
import { GetSubjectsNotEnrolledResponse } from '#student/infrastructure/controller/enrollment/get-subjects-not-enrolled/get-subjects-not-enrolled.response';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

@Controller('subject')
export class GetSubjectsNotEnrolledController {
  constructor(private readonly handler: GetSubjectsNotEnrolledHandler) {}

  @Get('academic-record/:id/not-enrolled')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.GESTOR_360,
    AdminUserRoles.SUPERVISOR_360,
  )
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  async getSubjectsNotEnrolled(
    @Param('id') id: string,
    @Request() request: AuthRequest,
  ): Promise<GetSubjectsNotEnrolledResponse> {
    const query = new GetSubjectsNotEnrolledQuery(id, request.user);

    const subjects = await this.handler.handle(query);

    return GetSubjectsNotEnrolledResponse.create(subjects);
  }
}
