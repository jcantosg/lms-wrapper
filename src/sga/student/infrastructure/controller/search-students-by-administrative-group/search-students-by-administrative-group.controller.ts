import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';

import { SearchStudentsByAdministrativeGroupHandler } from '#student/application/search-students-by-administrative-group/search-students-by-administrative-group.handler';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { SearchStudentsByAdministrativeGroupQuery } from '#student/application/search-students-by-administrative-group/search-students-by-administrative-group.query';
import {
  GetAllStudentsByAdministrativeGroupResponse,
  GetStudentByAdministrativeGroupResponse,
} from '#student/infrastructure/controller/get-all-students-by-administrative-group/get-all-students-by-administrative-group.response';
import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';
import { searchStudentsByAdministrativeGroupSchema } from '#student/infrastructure/config/validation-schema/search-students-by-administrative-group.schema';

type SearchStudentsByAdministrativeGroupQueryParams = {
  page: number;
  limit: number;
  orderBy: string;
  orderType: OrderTypes;
  text: string;
};

@Controller('administrative-group')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(
  AdminUserRoles.SUPERADMIN,
  AdminUserRoles.JEFATURA,
  AdminUserRoles.SECRETARIA,
  AdminUserRoles.SUPERVISOR_SECRETARIA,
  AdminUserRoles.SUPERVISOR_JEFATURA,
)
@UsePipes(
  new JoiRequestQueryParamValidationPipeService(
    searchStudentsByAdministrativeGroupSchema,
  ),
  new JoiRequestParamIdValidationPipeService(uuidSchema),
)
export class SearchStudentsByAdministrativeGroupController {
  constructor(
    private readonly handler: SearchStudentsByAdministrativeGroupHandler,
  ) {}
  @Get(':administrativeGroupId/student/search')
  async list(
    @Req() req: AuthRequest,
    @Param('administrativeGroupId') administrativeGroupId: string,
    @Query() queryParams: SearchStudentsByAdministrativeGroupQueryParams,
  ): Promise<CollectionResponse<GetStudentByAdministrativeGroupResponse>> {
    const query = new SearchStudentsByAdministrativeGroupQuery(
      req.user,
      queryParams.text,
      queryParams.page,
      queryParams.limit,
      queryParams.orderBy,
      queryParams.orderType,
      administrativeGroupId,
    );

    const response = await this.handler.handle(query);

    return GetAllStudentsByAdministrativeGroupResponse.create(
      response.items,
      queryParams.page,
      queryParams.limit,
      response.total,
    );
  }
}
