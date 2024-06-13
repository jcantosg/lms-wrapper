import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { GetAllStudentsByAdministrativeGroupHandler } from '#student/application/get-all-students-by-administrative-group/get-all-students-by-administrative-group.handler';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';
import { GetAllStudentsByAdministrativeGroupQuery } from '#student/application/get-all-students-by-administrative-group/get-all-students-by-administrative-group.query';
import { getAllStudentsByAdministrativeGroupSchema } from '#student/infrastructure/config/validation-schema/get-all-students-by-administrative-group.schema';
import {
  GetAllStudentsByAdministrativeGroupResponse,
  GetStudentByAdministrativeGroupResponse,
} from '#student/infrastructure/controller/get-all-students-by-administrative-group/get-all-students-by-administrative-group.response';

interface GetAllStudentsByAdministrativeGroupQueryParams {
  page: number;
  limit: number;
  orderBy: string;
  orderType: OrderTypes;
}

@Controller('administrative-group')
export class GetAllStudentsByAdministrativeGroupController {
  constructor(
    private readonly handler: GetAllStudentsByAdministrativeGroupHandler,
  ) {}

  @Get(':administrativeGroupId/student')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.JEFATURA,
    AdminUserRoles.SECRETARIA,
    AdminUserRoles.SUPERVISOR_SECRETARIA,
    AdminUserRoles.SUPERVISOR_JEFATURA,
  )
  @UsePipes(
    new JoiRequestParamIdValidationPipeService(uuidSchema),
    new JoiRequestQueryParamValidationPipeService(
      getAllStudentsByAdministrativeGroupSchema,
    ),
  )
  async getStudentsByAdministrativeGroup(
    @Param('administrativeGroupId') administrativeGroupId: string,
    @Query() params: GetAllStudentsByAdministrativeGroupQueryParams,
    @Request() request: AuthRequest,
  ): Promise<CollectionResponse<GetStudentByAdministrativeGroupResponse>> {
    const query = new GetAllStudentsByAdministrativeGroupQuery(
      request.user,
      params.page,
      params.limit,
      params.orderBy,
      params.orderType,
      administrativeGroupId,
    );

    const response = await this.handler.handle(query);

    return GetAllStudentsByAdministrativeGroupResponse.create(
      response.items,
      params.page,
      params.limit,
      response.total,
    );
  }
}
